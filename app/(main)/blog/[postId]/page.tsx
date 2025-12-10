import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CommentSection } from '@/components/web/comment-section';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { fetchQuery } from 'convex/nextjs';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface PostIdProps {
  params: Promise<{ postId: Id<'posts'> }>;
}

const PostIdPage = async ({ params }: PostIdProps) => {
  const { postId } = await params;
  const data = await fetchQuery(api.posts.getById, { postId: postId });

  if (!data) return <h1 className="text-6xl font-bold">No post found!</h1>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
      <Link className={buttonVariants({ variant: 'outline', class: 'mb-4' })} href="/blog" prefetch>
        <ArrowLeft />
        Back to Blog
      </Link>

      <div className="relative w-full h-[400px] mb-8 rounded-t-xl overflow-hidden shadow-sm">
        <Image
          src={
            data.imageUrl ??
            'https://images.unsplash.com/photo-1764082497081-a023b72c9239?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }
          alt={data.title ?? 'Posting image'}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="space-y-4 flex flex-col">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">{data.title}</h1>
        <p className="text-sm text-muted-foreground">
          Posted: {formatDistanceToNow(new Date(data._creationTime!), { addSuffix: true })}
        </p>
        <Separator className="my-8" />
      </div>
      <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">{data.body}</p>
      <Separator className="my-8" />
      <CommentSection />
    </div>
  );
};

export default PostIdPage;
