import { buttonVariants } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { fetchQuery } from 'convex/nextjs';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PostIdProps {
  params: Promise<{ postId: Id<'posts'> }>;
}

const PostIdPage = async ({ params }: PostIdProps) => {
  const { postId } = await params;
  const data = await fetchQuery(api.posts.getById, { postId: postId });
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
      <Link className={buttonVariants({ variant: 'ghost' })} href="/blog" prefetch>
        <ArrowLeft />
        Back to Blog
      </Link>

      <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden shadow-sm">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default PostIdPage;
