'use server';
import { fetchMutation } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getToken } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import z from 'zod';
import { postSchema } from './schemas/blog';

export async function createPostAction(data: z.infer<typeof postSchema>) {
  const parsed = postSchema.safeParse(data);
  if (!parsed) throw new Error('Something went wrong!');

  const token = await getToken();
  await fetchMutation(
    api.posts.create,
    {
      body: parsed.data?.content as string,
      title: parsed.data?.title as string,
    },
    { token },
  );
  redirect('/');
}
