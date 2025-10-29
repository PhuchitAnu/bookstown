'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce';

const Search = () => {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search')?.toString() || '');

    const handleSearch = useDebouncedCallback((value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set('search', value);
        } else {
            params.delete('search');
        }
        replace(`/store/search?${params.toString()}`);
    }, 500);

    useEffect(() => {
        setSearchQuery(searchParams.get('search')?.toString() || '');
    }, [searchParams]);

    return (
        <div className="hidden md:flex flex-1 justify-center px-6">
            <div className="relative w-full max-w-md">
                <input
                    type="text"
                    placeholder="Search books..."
                    className="border border-gray-300 rounded-full w-full pl-10 pr-4 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        handleSearch(e.target.value);
                    }}
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    className="absolute top-2.5 left-3 text-gray-400"
                >
                    <path
                        fill="currentColor"
                        d="m19.485 20.154l-6.262-6.262q-.75.639-1.725.989t-1.96.35q-2.402 0-4.066-1.663T3.808 9.503T5.47 5.436t4.064-1.667t4.068 1.664T15.268 9.5q0 1.042-.369 2.017t-.97 1.668l6.262 6.261zM9.539 14.23q1.99 0 3.36-1.37t1.37-3.361t-1.37-3.36t-3.36-1.37t-3.361 1.37t-1.37 3.36t1.37 3.36t3.36 1.37"
                    />
                </svg>
            </div>
        </div>
    )
}

export default Search
