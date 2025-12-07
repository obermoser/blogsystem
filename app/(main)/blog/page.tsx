'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';

export default function Blog() {
  const data = useQuery(api.posts.get);

  if (data == undefined) {
    return (
      <div className="flex flex-col gap-y-4">
        <Skeleton className="w-md h-8" />
        <Skeleton className="w-sm h-3.5 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      {data?.map((dat) => (
        <article key={dat._id} className="flex flex-col gap-y-1 mb-4">
          <h2 className="text-3xl font-bold">{dat.title}</h2>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(dat._creationTime, { addSuffix: true })}
          </p>
        </article>
      ))}
    </div>
  );
}
