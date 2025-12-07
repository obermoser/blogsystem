import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('posts').order('desc').collect();
  },
});

export const create = mutation({
  args: { title: v.string(), body: v.string() },
  handler: async (ctx, { title, body }) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;

    if (!userId) throw new ConvexError('UNAUTHORIZED!');

    return await ctx.db.insert('posts', {
      title,
      body,
      authorId: userId,
    });
  },
});
