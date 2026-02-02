import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  cards: defineTable({
    customId: v.string(),
    task: v.string(),
    editKey: v.string(),
  }).index("by_customId", ["customId"]),

  cardEntries: defineTable({
    username: v.string(),
    gpsPosition: v.optional(
      v.object({
        lat: v.number(),
        lng: v.number(),
      })
    ),
    location: v.optional(v.string()),
    city: v.optional(v.string()), // City name derived from GPS
    date: v.number(), // timestamp
    comment: v.optional(v.string()),
    photo: v.optional(v.string()), // URL
    instagram: v.optional(v.string()), // Instagram handle
    interestedInBuying: v.optional(v.boolean()), // Whether user is interested in buying cards
    cardId: v.id("cards"),
  })
    .index("by_cardId", ["cardId"])
    .index("by_username", ["username"])
    .index("by_date", ["date"]),

  artistSuggestions: defineTable({
    name: v.string(),
    count: v.optional(v.number()),
    cardEntryId: v.id("cardEntries"),
  })
    .index("by_cardEntryId", ["cardEntryId"])
    .index("by_name", ["name"]),

  taskSuggestions: defineTable({
    description: v.string(),
    cardEntryId: v.id("cardEntries"),
  }).index("by_cardEntryId", ["cardEntryId"]),

  messages: defineTable({
    username: v.string(),
    content: v.string(),
    timestamp: v.number(),
  }).index("by_timestamp", ["timestamp"]),
});
