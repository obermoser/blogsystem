import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import { formatDistanceToNow } from 'date-fns';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

export const dynamic = 'force-static';
export const revalidate = 30;

export const metadata: Metadata = {
  title: 'Blog | nextJS 16 Tutorial',
  description: 'Read our latest articles and insights',
  category: 'Web Development',
  authors: [{ name: 'Bernhard Obermoser' }],
};

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
  const data = await fetchQuery(api.posts.get);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.map((post) => (
        <Card key={post._id} className="pt-0">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              className="rounded-t-lg object-cover"
              src={
                post.imageUrl ??
                'https://images.unsplash.com/photo-1764082497081-a023b72c9239?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              }
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

function BlogListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Wir erstellen ein Array mit 3 Elementen für die 3 Cards */}
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="pt-0 flex flex-col h-full gap-y-3">
          {/* Image Skeleton (h-48 entspricht deinem Code) */}
          <div className="h-48 w-full">
            <Skeleton className="h-full w-full rounded-t-lg rounded-b-none" />
          </div>

          <CardContent className="flex-1 mt-6 space-y-4 gap-y-4">
            {/* Title Skeleton (h-8 für text-2xl) */}
            <Skeleton className="h-8 w-3/4" />

            {/* Body Text Skeletons (3 Zeilen für line-clamp-3) */}
            <div className="space-y-2 gap-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col pt-0">
            {/* Button Skeleton (h-10 ist Standard Button Höhe) */}
            <Skeleton className="h-10 w-full rounded-md" />

            {/* Timestamp Skeleton (h-3 für text-xs) */}
            <div className="pt-2 w-full flex justify-center">
              <Skeleton className="h-3 w-24" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
