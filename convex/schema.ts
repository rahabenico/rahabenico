import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  cards: defineTable({
    customId: v.string(),
    task: v.string(),
  })
    .index("by_customId", ["customId"]),

  cardEntries: defineTable({
    username: v.string(),
    gpsPosition: v.optional(
      v.object({
        lat: v.number(),
        lng: v.number(),
      })
    ),
    location: v.string(),
    date: v.number(), // timestamp
    comment: v.string(),
    photo: v.optional(v.string()), // URL
    cardId: v.id("cards"),
  })
    .index("by_cardId", ["cardId"])
    .index("by_username", ["username"])
    .index("by_date", ["date"]),

  djPicks: defineTable({
    artistName: v.string(),
  }),

  taskSuggestions: defineTable({
    description: v.string(),
  }),
});

