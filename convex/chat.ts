import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const sendMessage = mutation({
  args: {
    username: v.string(),
    content: v.string(),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      username: args.username.trim(),
      content: args.content.trim(),
      timestamp: args.timestamp,
    });
    return messageId;
  },
});

export const getMessages = query({
  handler: async (ctx) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_timestamp", (q) => q.gte("timestamp", 0))
      .order("asc")
      .collect();

    return messages;
  },
});
