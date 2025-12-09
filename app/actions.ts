'use server';
import { fetchMutation } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getToken } from '@/lib/auth-server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import z from 'zod';
import { postSchema } from './schemas/blog';

export async function createPostAction(data: z.infer<typeof postSchema>) {
  try {
    const parsed = postSchema.safeParse(data);
    if (!parsed) throw new Error('Something went wrong!');

    const token = await getToken();
    const imageUrl = await fetchMutation(api.posts.generateImageUploadUrl, {}, { token });

    const uploadResult = await fetch(imageUrl, {
      method: 'POST',
      headers: {
        'Content-Type': parsed.data?.image.type || 'application/octet-stream',
      },
      body: parsed.data?.image,
    });

    if (!uploadResult.ok) throw new Error('Something went wrong during upload');
    const { storageId } = await uploadResult.json();

    await fetchMutation(
      api.posts.create,
      {
        body: parsed.data?.content as string,
        title: parsed.data?.title as string,
        imageStorageId: storageId,
      },
      { token },
    );
  } catch {
    return {
      error: 'Failed to create upload url',
    };
  }
  revalidatePath('/blog');

  redirect('/');
}
