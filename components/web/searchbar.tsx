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
    <div className="relative w-full max-w-sm">
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
            <div>
              <Loader2 />
              Searching...
            </div>
          ) : results.length === 0 ? (
            <p>No results found!</p>
          ) : (
            <div className="py-1">
              {results?.map((result) => (
                <Link key={result._id} href={`/blog/${result._id}`} prefetch>
                  <p>{result.title}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
