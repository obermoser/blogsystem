'use client';

import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { Input } from '../ui/input';

const SearchBar = () => {
  const [keyword, setKeyword] = useState('');
  const [open, setOpen] = useState(false);

  const results = useQuery(
    api.posts.searchPosts,
    keyword.length >= 2
      ? {
          limit: 3,
          keyword,
        }
      : 'skip',
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    setOpen(true);
  };

  return (
    <div className="relative w-full max-w-sm z-10">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search posts..."
          className="w-full pl-8 bg-background"
          value={keyword}
          onChange={handleInputChange}
        />
      </div>

      {open && keyword.length >= 2 && (
        <div className="absolute top-full mt-2 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
          {results === undefined ? (
            <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
              <Loader2 className="my-2 size-4 animate-spin" />
              Searching...
            </div>
          ) : results.length === 0 ? (
            <p className="p-4 text-muted-foreground text-sm text-center">No results found!</p>
          ) : (
            <>
              {results?.map((result) => (
                <div
                  key={result._id}
                  className="flex flex-col px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                >
                  <Link
                    href={`/blog/${result._id}`}
                    onClick={() => {
                      setOpen(false);
                      setKeyword('');
                    }}
                    prefetch
                  >
                    <p className="font-medium truncate pt-1">{result.title}</p>
                    <p className="text-xs text-muted-foreground">{result.body.substring(0, 60)}</p>
                  </Link>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
