'use client';
import { commentSchema } from '@/app/schemas/comment';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { Loader2, MessageSquare } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Textarea } from '../ui/textarea';

export function CommentSection() {
  const [isPending, startTransition] = useTransition();
  const params = useParams<{ postId: Id<'posts'> }>();
  const createComment = useMutation(api.comments.create);

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
      }
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 border-b">
        <MessageSquare className="size-5" />
        <h2 className="text-xl font-bold">5 Comments</h2>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
