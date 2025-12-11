import { ConvexError, v } from 'convex/values';
import { Doc } from './_generated/dataModel';
import { mutation, query } from './_generated/server';

export const getById = query({
  args: { postId: v.id('posts') },
  handler: async (ctx, { postId }) => {
    const post = await ctx.db.get(postId);
    const resolvedImageUrl =
      post?.imageStorageId !== undefined ? await ctx.storage.getUrl(post.imageStorageId) : null;

    return {
      ...post,
      imageUrl: resolvedImageUrl,
    };
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query('posts').order('desc').collect();

    return await Promise.all(
      posts.map(async (post) => {
        const resolvedImgUrl =
          post.imageStorageId !== undefined ? await ctx.storage.getUrl(post.imageStorageId) : null;
        return { ...post, imageUrl: resolvedImgUrl };
      }),
    );
  },
});

export const create = mutation({
  args: { title: v.string(), body: v.string(), imageStorageId: v.id('_storage') },
  handler: async (ctx, { title, body, imageStorageId }) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;

    if (!userId) throw new ConvexError('UNAUTHORIZED!');

    return await ctx.db.insert('posts', {
      title,
      body,
      imageStorageId,
      authorId: userId,
    });
  },
});

export const generateImageUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;

    if (!userId) throw new ConvexError('UNAUTHORIZED!');

    return await ctx.storage.generateUploadUrl();
  },
});

interface searchResultTypes {
  _id: string;
  title: string;
  body: string;
}

export const searchPosts = query({
  args: {
    keyword: v.string(),
    limit: v.number(),
  },
  handler: async (ctx, { keyword, limit }) => {
    const results: Array<searchResultTypes> = [];
    const seen = new Set();

    const pushDocs = async (docs: Array<Doc<'posts'>>) => {
      for (const doc of docs) {
        if (seen.has(doc._id)) continue;
        seen.add(doc._id);
        results.push({
          _id: doc._id,
          title: doc.title,
          body: doc.body,
        });
        if (results.length >= limit) break;
      }
    };

    const titleMatches = await ctx.db
      .query('posts')
      .withSearchIndex('search_title', (q) => q.search('title', keyword))
      .take(limit);

    await pushDocs(titleMatches);
    if (results.length < limit) {
      const bodyMatches = await ctx.db
        .query('posts')
        .withSearchIndex('search_body', (q) => q.search('body', keyword))
        .take(limit);
      await pushDocs(bodyMatches);
    }

    return results;
  },
});
