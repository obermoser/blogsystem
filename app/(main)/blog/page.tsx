import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import BlogListSkeleton from './blog-list-skeleton';

export default async function Blog() {
  return (
    <div className="py-12">
      <div className="text-center pb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Our blog</h1>
        <p className="pt-4  max-w-2xl mx-auto text-xl text-muted-foreground">
          Insights, thoughts and trends from our team!
        </p>
      </div>
      <Suspense fallback={<BlogListSkeleton />}>
        <LoadBLogList />
      </Suspense>
    </div>
  );
}

async function LoadBLogList() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const data = await fetchQuery(api.posts.get);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.map((post) => (
        <Card key={post._id} className="pt-0">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              className="rounded-t-lg"
              src="https://images.unsplash.com/photo-1764082497081-a023b72c9239?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Example image"
              fill
            />
          </div>
          <CardContent>
            <Link href={`/blog/${post._id}`}>
              <h1 className="text-2xl font-bold hover:text-primary">{post.title}</h1>
            </Link>
            <p className="text-muted-foreground line-clamp-3">{post.body}</p>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Link className={buttonVariants({ className: 'w-full' })} href={`/blog/${post._id}`}>
              Read more
            </Link>
            <p className="pt-2 text-xs text-muted-foreground">
              {formatDistanceToNow(post._creationTime, { addSuffix: true })}
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
