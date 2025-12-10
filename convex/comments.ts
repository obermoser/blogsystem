import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const getCommentsByPost = query({
  args: {
    postingId: v.id('posts'),
  },
  handler: async (ctx, { postingId }) => {
    return await ctx.db
      .query('comments')
      .withIndex('by_postingId', (q) => q.eq('postId', postingId))
      .order('desc')
      .collect();
  },
});

export const create = mutation({
  args: {
    postingId: v.id('posts'),
    body: v.string(),
  },
  handler: async (ctx, { postingId, body }) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;

    if (!userId) throw new ConvexError('UNAUTHORIZED!');

    if (!body || !postingId) throw new ConvexError('UNDEFINED!');

    return await ctx.db.insert('comments', {
      postId: postingId,
      body,
      authorId: userId,
      authorName: identity?.name ?? 'Anonymous',
    });
  },
});
