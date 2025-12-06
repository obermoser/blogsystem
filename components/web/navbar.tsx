import Link from 'next/link';
import { Button } from '../ui/button';
import { ModeToggle } from './mode-toggle';

export function Navbar() {
  return (
    <nav className="w-full py-5 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/">
          <h1 className="text-3xl font-bold">
            Next<span className="text-blue-500">Pro</span>
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
        <Button asChild>
          <Link href="/auth/sign-up">Sign up</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/auth/sign-in">Sign in</Link>
        </Button>
        <ModeToggle />
      </div>
    </nav>
  );
}
