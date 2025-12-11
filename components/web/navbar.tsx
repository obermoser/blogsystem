'use client';
import { authClient } from '@/lib/auth-client';
import { useConvexAuth } from 'convex/react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { ModeToggle } from './mode-toggle';
import SearchBar from './searchbar';

export function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  return (
    <nav className="w-full py-5 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/">
          <h1 className="text-3xl font-bold">
            Next<span className="text-primary">Pro</span>
          </h1>
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/">Home</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/blog">Blog</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/create">Create</Link>
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden md:block mr-2">
          <SearchBar />
        </div>
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : isAuthenticated ? (
          <Button
            onClick={() =>
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    toast.success('Logged out successfully');
                    router.push('/');
                  },
                  onError: (error) => {
                    toast.error(error.error.message);
                  },
                },
              })
            }
          >
            Logout
          </Button>
        ) : (
          <>
            <Button asChild>
              <Link href="/auth/sign-up">Sign up</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/auth/sign-in">Sign in</Link>
            </Button>
          </>
        )}

        <ModeToggle />
      </div>
    </nav>
  );
}
