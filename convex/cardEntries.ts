import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCardByCustomId = query({
  args: { customId: v.string() },
  handler: async (ctx, args) => {
    const card = await ctx.db
      .query("cards")
      .withIndex("by_customId", (q) => q.eq("customId", args.customId))
      .first();
    return card;
  },
});

export const getAllCards = query({
  handler: async (ctx) => {
    const cards = await ctx.db.query("cards").collect();
    return cards;
  },
});

export const getAllArtistSuggestions = query({
  handler: async (ctx) => {
    const allSuggestions = await ctx.db.query("artistSuggestions").collect();

    // Group by name and sum counts (handle undefined count for migration)
    const artistMap = new Map<string, number>();

    for (const suggestion of allSuggestions) {
      const currentCount = artistMap.get(suggestion.name) || 0;
      const suggestionCount = suggestion.count ?? 1; // Default to 1 for existing records without count
      artistMap.set(suggestion.name, currentCount + suggestionCount);
    }

    // Convert to array and sort by count descending
    const sortedArtists = Array.from(artistMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return sortedArtists;
  },
});

export const getCardEntriesByCardId = query({
  args: { cardId: v.id("cards") },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query("cardEntries")
      .withIndex("by_cardId", (q) => q.eq("cardId", args.cardId))
      .order("desc") // Most recent first
      .collect();

    // Sort by date descending (most recent first)
    const sortedEntries = entries.sort((a, b) => b.date - a.date);

    // Fetch suggestions for each entry
    const entriesWithSuggestions = await Promise.all(
      sortedEntries.map(async (entry) => {
        const artistSuggestions = await ctx.db
          .query("artistSuggestions")
          .withIndex("by_cardEntryId", (q) => q.eq("cardEntryId", entry._id))
          .collect();

        const taskSuggestions = await ctx.db
          .query("taskSuggestions")
          .withIndex("by_cardEntryId", (q) => q.eq("cardEntryId", entry._id))
          .collect();

        return {
          ...entry,
          artistSuggestions: artistSuggestions.map(s => s.name),
          taskSuggestions: taskSuggestions.map(s => s.description),
        };
      })
    );

    return entriesWithSuggestions;
  },
});


export const createCard = mutation({
  args: {
    customId: v.string(),
    task: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if card with this customId already exists
    const existing = await ctx.db
      .query("cards")
      .withIndex("by_customId", (q) => q.eq("customId", args.customId))
      .first();

    if (existing) {
      throw new Error(`Card with customId "${args.customId}" already exists`);
    }

    // Generate a random edit key (18 digits for security)
    const editKey = Math.random().toString().slice(2, 20);

    const cardId = await ctx.db.insert("cards", {
      customId: args.customId,
      task: args.task,
      editKey: editKey,
    });

    return { cardId, editKey };
  },
});

export const createCardEntry = mutation({
  args: {
    cardId: v.id("cards"),
    username: v.string(),
    gpsPosition: v.optional(
      v.object({
        lat: v.number(),
        lng: v.number(),
      })
    ),
    location: v.optional(v.string()),
    city: v.optional(v.string()),
    date: v.number(),
    comment: v.optional(v.string()),
    artistSuggestions: v.optional(v.array(v.string())),
    taskSuggestions: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Create the card entry
    const cardEntryId = await ctx.db.insert("cardEntries", {
      cardId: args.cardId,
      username: args.username,
      gpsPosition: args.gpsPosition,
      location: args.location,
      city: args.city,
      date: args.date,
      comment: args.comment,
    });

    // Create artist suggestions if provided
    if (args.artistSuggestions && args.artistSuggestions.length > 0) {
      for (const name of args.artistSuggestions) {
        if (name.trim()) {
          const trimmedName = name.trim();

          // Check if this artist suggestion already exists
          const existingSuggestion = await ctx.db
            .query("artistSuggestions")
            .withIndex("by_name", (q) => q.eq("name", trimmedName))
            .first();

          if (existingSuggestion) {
            // Increment the counter for existing artist (handle undefined count for migration)
            const currentCount = existingSuggestion.count ?? 1;
            await ctx.db.patch(existingSuggestion._id, {
              count: currentCount + 1,
            });
          } else {
            // Create new artist suggestion with count 1
            await ctx.db.insert("artistSuggestions", {
              name: trimmedName,
              count: 1,
              cardEntryId,
            });
          }
        }
      }
    }

    // Create task suggestions if provided
    if (args.taskSuggestions && args.taskSuggestions.length > 0) {
      for (const description of args.taskSuggestions) {
        if (description.trim()) {
          await ctx.db.insert("taskSuggestions", {
            description: description.trim(),
            cardEntryId,
          });
        }
      }
    }

    return cardEntryId;
  },
});

