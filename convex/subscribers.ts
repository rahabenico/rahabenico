import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction, internalMutation, internalQuery, mutation } from "./_generated/server";

/**
 * Subscribe an email to notifications for a specific card
 * Internal mutation - can be called from other mutations
 */
export const subscribeToCard = internalMutation({
  args: {
    cardId: v.id("cards"),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if subscription already exists
    const existing = await ctx.db
      .query("cardSubscribers")
      .withIndex("by_cardId_email", (q) => q.eq("cardId", args.cardId).eq("email", args.email))
      .first();

    if (existing) {
      // Already subscribed, just return the existing subscription
      return existing._id;
    }

    // Create new subscription
    const subscriberId = await ctx.db.insert("cardSubscribers", {
      cardId: args.cardId,
      email: args.email,
      subscribedAt: Date.now(),
    });

    return subscriberId;
  },
});

/**
 * Unsubscribe an email from notifications for a specific card
 */
export const unsubscribeFromCard = mutation({
  args: {
    cardId: v.id("cards"),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const subscriber = await ctx.db
      .query("cardSubscribers")
      .withIndex("by_cardId_email", (q) => q.eq("cardId", args.cardId).eq("email", args.email))
      .first();

    if (subscriber) {
      await ctx.db.delete(subscriber._id);
      return { success: true };
    }

    return { success: false, message: "Subscription not found" };
  },
});

/**
 * Get all subscribers for a specific card
 * Internal query - can be called from actions
 */
export const getCardSubscribers = internalQuery({
  args: {
    cardId: v.id("cards"),
  },
  handler: async (ctx, args) => {
    const subscribers = await ctx.db
      .query("cardSubscribers")
      .withIndex("by_cardId", (q) => q.eq("cardId", args.cardId))
      .collect();

    return subscribers.map((s) => s.email);
  },
});

/**
 * Send notification emails to all subscribers when a new entry is created
 * This is called as an internal action from createCardEntry.
 */
export const sendNotificationEmails = internalAction({
  args: {
    cardId: v.id("cards"),
    cardCustomId: v.string(),
    entryUsername: v.string(),
  },
  handler: async (ctx, args): Promise<{ sent: number; total?: number; error?: string; errors?: string[] }> => {
    // Get all subscribers for this card
    const subscribers: string[] = await ctx.runQuery(internal.subscribers.getCardSubscribers, {
      cardId: args.cardId,
    });

    if (subscribers.length === 0) {
      return { sent: 0 };
    }

    // Get Mailjet credentials from environment variables
    const mailjetApiKey = process.env.MAILJET_API_KEY;
    const mailjetApiSecret = process.env.MAILJET_API_SECRET;
    const baseUrl = process.env.BASE_URL || "https://rahabenico.vercel.app";

    if (!mailjetApiKey || !mailjetApiSecret) {
      console.error("Mailjet credentials not configured");
      return { sent: 0, error: "Mailjet not configured" };
    }

    // Prepare email content template
    const emailSubject = `New entry added to card "${args.cardCustomId}"`;

    // Send emails via Mailjet API
    let sentCount = 0;
    const errors: string[] = [];

    for (const email of subscribers) {
      try {
        // Construct personalized unsubscribe URL
        const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}&cardId=${args.cardCustomId}`;

        // Prepare personalized email content
        const emailHtml = `
          <html>
            <body>
              <h2>New Entry Added</h2>
              <p>A new entry has been added to the card "${args.cardCustomId}" by ${args.entryUsername}.</p>
              <p><a href="${baseUrl}/card/${args.cardCustomId}">View the card</a></p>
              <hr>
              <p><small>If you no longer wish to receive these notifications, <a href="${unsubscribeUrl}">unsubscribe here</a>.</small></p>
            </body>
          </html>
        `;

        const emailText = `
New Entry Added

A new entry has been added to the card "${args.cardCustomId}" by ${args.entryUsername}.

View the card: ${baseUrl}/card/${args.cardCustomId}

If you no longer wish to receive these notifications, unsubscribe here: ${unsubscribeUrl}
        `;

        // Encode credentials to base64 (using a simple base64 encoder that works in Convex runtime)
        const credentials = btoa(unescape(encodeURIComponent(`${mailjetApiKey}:${mailjetApiSecret}`)));

        const response = await fetch("https://api.mailjet.com/v3.1/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${credentials}`,
          },
          body: JSON.stringify({
            Messages: [
              {
                From: {
                  Email: process.env.MAILJET_FROM_EMAIL || "noreply@rahabenico.com",
                  Name: "Rahabenico",
                },
                To: [
                  {
                    Email: email,
                  },
                ],
                Subject: emailSubject,
                TextPart: emailText,
                HTMLPart: emailHtml,
              },
            ],
          }),
        });

        if (!response.ok) {
          const errorData = await response.text();
          errors.push(`Failed to send to ${email}: ${errorData}`);
          console.error(`Mailjet error for ${email}:`, errorData);
        } else {
          sentCount++;
        }
      } catch (error) {
        errors.push(`Error sending to ${email}: ${error instanceof Error ? error.message : String(error)}`);
        console.error(`Error sending email to ${email}:`, error);
      }
    }

    return {
      sent: sentCount,
      total: subscribers.length,
      errors: errors.length > 0 ? errors : undefined,
    };
  },
});
