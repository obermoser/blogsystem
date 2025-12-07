import { ConvexError, v } from 'convex/values';
import { mutation } from './_generated/server';

export const createPost = mutation({
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
