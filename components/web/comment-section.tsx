'use client';
import { commentSchema } from '@/app/schemas/comment';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { zodResolver } from '@hookform/resolvers/zod';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { Preloaded, useMutation, usePreloadedQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, MessageSquare } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';

interface CommentSectionProps {
  preloadedComments: Preloaded<typeof api.comments.getCommentsByPost>;
}

export function CommentSection({ preloadedComments }: CommentSectionProps) {
  const [isPending, startTransition] = useTransition();
  const params = useParams<{ postId: Id<'posts'> }>();
  const createComment = useMutation(api.comments.create);
  const data = usePreloadedQuery(preloadedComments);

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body: '',
      postId: params.postId,
    },
  });

  const onHandleSubmit = (values: z.infer<typeof commentSchema>) => {
    startTransition(() => {
      try {
        const promise = createComment({ body: values.body, postingId: values.postId });
        toast.promise(promise, {
          loading: 'Saving your comment...',
          success: 'Your comment is now live',
          error: 'Something went wrong!',
        });
      } catch (e) {
        console.error(e);
      } finally {
        form.reset();
      }
    });
  };
  if (data === undefined) return <p>Loading...</p>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 border-b">
        <MessageSquare className="size-5" />
        <h2 className="text-xl font-bold">{data?.length} Comments</h2>
      </CardHeader>
      <CardContent className="space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onHandleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Share your thoughts" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isPending}>
              {isPending ? <Loader2 className="size-4 animate-spin" /> : <p>Submit</p>}
            </Button>
          </form>
        </Form>
        {data?.length > 0 && <Separator />}
        <section className="space-y-6">
          {data?.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <Avatar className="size-10 shrink-0">
                <AvatarImage
                  alt={comment.authorName}
                  src={`https://avatar.vercel.sh/${comment.authorName}`}
                />
                <AvatarFallback>{comment.authorName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{comment.authorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment._creationTime), { addSuffix: true })}
                  </p>
                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {comment.body}
                </p>
              </div>
            </div>
          ))}
        </section>
      </CardContent>
    </Card>
  );
}
