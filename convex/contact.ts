"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";

export const sendContactEmail = action({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (_ctx, args) => {
    // Get Mailjet API credentials from environment variables
    const apiKey = process.env.MAILJET_API_KEY;
    const apiSecret = process.env.MAILJET_API_SECRET;
    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL;
    // Optional: Use a verified sender email (defaults to recipientEmail if not set)
    const senderEmail = process.env.MAILJET_SENDER_EMAIL || recipientEmail;

    if (!apiKey || !apiSecret || !recipientEmail) {
      throw new Error(
        "Mailjet configuration is missing. Please set MAILJET_API_KEY, MAILJET_API_SECRET, and CONTACT_RECIPIENT_EMAIL environment variables."
      );
    }

    // Mailjet API endpoint
    const url = "https://api.mailjet.com/v3.1/send";

    // Prepare email data
    const emailData = {
      Messages: [
        {
          From: {
            Email: senderEmail, // Use verified sender email
            Name: "Rahabenico Contact Form",
          },
          To: [
            {
              Email: recipientEmail,
              Name: "Rahabenico Contact",
            },
          ],
          ReplyTo: {
            Email: args.email,
            Name: args.name,
          },
          Subject: `Contact Form: ${args.subject}`,
          TextPart: `Name: ${args.name}\nEmail: ${args.email}\nSubject: ${args.subject}\n\nMessage:\n${args.message}`,
          HTMLPart: `
            <h2>Contact Form Submission</h2>
            <p><strong>Name:</strong> ${args.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${args.email}">${args.email}</a></p>
            <p><strong>Subject:</strong> ${args.subject}</p>
            <hr>
            <p><strong>Message:</strong></p>
            <p>${args.message.replace(/\n/g, "<br>")}</p>
          `,
        },
      ],
    };

    // Create base64 encoded credentials for Basic Auth
    // Using a simple base64 encoding function that works in Convex
    const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

    // Send email via Mailjet API
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to send email: ${response.status} ${errorData}`);
    }

    const result = await response.json();
    return { success: true, messageId: result.Messages?.[0]?.To?.[0]?.MessageID };
  },
});
