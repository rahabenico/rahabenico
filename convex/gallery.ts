import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";

/**
 * Get all gallery images with their URLs
 * This query fetches all gallery images and generates URLs for each stored file
 */
export const getGalleryImages = query({
  handler: async (ctx) => {
    // Try to get images ordered by order field, fall back to all images if no order index
    let images: Doc<"galleryImages">[] = await ctx.db.query("galleryImages").collect();
    try {
      const orderedImages = await ctx.db.query("galleryImages").withIndex("by_order").order("asc").collect();
      if (orderedImages.length > 0) {
        images = orderedImages;
      }
    } catch {
      // If order index doesn't exist or has no values, use all images
    }

    // If no images with order, try by date
    if (images.length === 0) {
      try {
        const datedImages = await ctx.db.query("galleryImages").withIndex("by_uploadedAt").order("desc").collect();
        if (datedImages.length > 0) {
          images = datedImages;
        }
      } catch {
        // Use existing images (empty array if none found)
      }
    }

    // Generate URLs for each image
    const imagesWithUrls = await Promise.all(
      images.map(async (image) => {
        const url = await ctx.storage.getUrl(image.storageId);
        return {
          ...image,
          url,
        };
      })
    );

    // Filter out images where URL generation failed (file no longer exists)
    return imagesWithUrls.filter((image) => image.url !== null);
  },
});

/**
 * Get gallery images ordered by upload date (fallback)
 */
export const getGalleryImagesByDate = query({
  handler: async (ctx) => {
    const images = await ctx.db.query("galleryImages").withIndex("by_uploadedAt").order("desc").collect();

    const imagesWithUrls = await Promise.all(
      images.map(async (image) => {
        const url = await ctx.storage.getUrl(image.storageId);
        return {
          ...image,
          url,
        };
      })
    );

    return imagesWithUrls.filter((image) => image.url !== null);
  },
});

/**
 * Add an image to the gallery
 * Use this mutation to add images that are already uploaded to Convex storage
 *
 * @example
 * ```typescript
 * await addGalleryImage({
 *   storageId: "k123abc...", // The storage ID from Convex file storage
 *   title: "My Image",
 *   description: "Optional description",
 *   order: 1 // Optional: for custom ordering
 * });
 * ```
 */
export const addGalleryImage = mutation({
  args: {
    storageId: v.id("_storage"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Verify the file exists
    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) {
      throw new Error("File not found in storage");
    }

    const imageId = await ctx.db.insert("galleryImages", {
      storageId: args.storageId,
      title: args.title,
      description: args.description,
      uploadedAt: Date.now(),
      order: args.order,
    });

    return imageId;
  },
});

/**
 * Bulk add multiple images to the gallery
 * Useful when you have multiple storage IDs from uploaded files
 *
 * @example
 * ```typescript
 * await bulkAddGalleryImages({
 *   images: [
 *     { storageId: "k123abc...", title: "Image 1" },
 *     { storageId: "k456def...", title: "Image 2" },
 *   ]
 * });
 * ```
 */
export const bulkAddGalleryImages = mutation({
  args: {
    images: v.array(
      v.object({
        storageId: v.id("_storage"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        order: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const results = [];
    const errors = [];

    for (const image of args.images) {
      try {
        // Verify the file exists
        const url = await ctx.storage.getUrl(image.storageId);
        if (!url) {
          errors.push({ storageId: image.storageId, error: "File not found" });
          continue;
        }

        // Check if already exists
        const existing = await ctx.db
          .query("galleryImages")
          .filter((q) => q.eq(q.field("storageId"), image.storageId))
          .first();

        if (existing) {
          errors.push({ storageId: image.storageId, error: "Already exists" });
          continue;
        }

        const imageId = await ctx.db.insert("galleryImages", {
          storageId: image.storageId,
          title: image.title,
          description: image.description,
          uploadedAt: Date.now(),
          order: image.order,
        });

        results.push({ storageId: image.storageId, imageId });
      } catch (error) {
        errors.push({
          storageId: image.storageId,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return { added: results, errors };
  },
});

/**
 * Query that directly displays images from storage IDs
 * This bypasses the database and directly queries storage
 * Useful for testing or when you want to display files without adding them to the gallery table
 *
 * Note: You need to provide the storage IDs - Convex doesn't have a way to list all files
 */
export const getImagesFromStorageIds = query({
  args: {
    storageIds: v.array(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const imagesWithUrls = await Promise.all(
      args.storageIds.map(async (storageId) => {
        const url = await ctx.storage.getUrl(storageId);
        return {
          storageId,
          url,
        };
      })
    );

    return imagesWithUrls.filter((image) => image.url !== null);
  },
});

/**
 * Discover and add files from storage IDs (simplified mutation version)
 *
 * IMPORTANT: Convex file storage doesn't provide a way to list all files.
 * You need to provide the storage IDs. You can get them from:
 * 1. Convex Dashboard > Storage tab - view all uploaded files
 * 2. Your upload code (when files are uploaded, you get storage IDs back)
 * 3. Any existing references in your database
 *
 * This mutation will:
 * - Check if each storage ID exists
 * - Add valid files to the gallery
 * - Skip files that don't exist or are already in the gallery
 *
 * @example
 * Run this from Convex Dashboard > Functions or from your code:
 * ```typescript
 * await ctx.runMutation(api.gallery.discoverAndAddFiles, {
 *   storageIds: [
 *     "k175abc123..." as Id<"_storage">,
 *     "k175def456..." as Id<"_storage">,
 *   ]
 * });
 * ```
 */
export const discoverAndAddFiles = mutation({
  args: {
    storageIds: v.array(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const results: Array<{ storageId: string; imageId: string; url: string }> = [];
    const errors: Array<{ storageId: string; error: string }> = [];

    for (const storageId of args.storageIds) {
      try {
        // Check if file exists
        const url = await ctx.storage.getUrl(storageId);
        if (!url) {
          errors.push({ storageId, error: "File not found in storage" });
          continue;
        }

        // Check if already in gallery
        const existing = await ctx.db
          .query("galleryImages")
          .filter((q) => q.eq(q.field("storageId"), storageId))
          .first();

        if (existing) {
          errors.push({ storageId, error: "Already in gallery" });
          continue;
        }

        // Add to gallery
        const imageId = await ctx.db.insert("galleryImages", {
          storageId,
          uploadedAt: Date.now(),
        });

        results.push({ storageId, imageId, url });
      } catch (error) {
        errors.push({
          storageId,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return {
      added: results,
      errors,
      summary: {
        total: args.storageIds.length,
        added: results.length,
        errors: errors.length,
      },
    };
  },
});

/**
 * Helper query to check if a storage ID already exists in the gallery
 */
export const checkStorageIdExists = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("galleryImages")
      .filter((q) => q.eq(q.field("storageId"), args.storageId))
      .first();
    return existing !== null;
  },
});
