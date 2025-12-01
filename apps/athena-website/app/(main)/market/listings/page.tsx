"use client";
import { useEffect, useState } from 'react'
import { Listing } from "@athena/types"
import ListingService from '@/api/ListingService';
import { useDebounce } from '@/app/_utils/debounce.util';
import { TextInput } from 'flowbite-react';
import { ListingCard } from '../_components/ListingCard';

export default function MyListingPage() {


  const [listings, setListings] = useState<Listing[]>([]);
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 300);


  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null)
      try {
        const data = (await ListingService.getMyDraft(
          debouncedQuery || undefined,
          undefined
        )).data
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to fetch listings");
      } finally {
        if (!cancelled) setLoading(false)
      }

    }
    run();
    return () => {
      cancelled = true;
    }

  }, [debouncedQuery])



  return (

    <section className="bg-background min-h-[70vh]">

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className='mb-6'>
          <label htmlFor="search" className="sr-only">
            Search listings
          </label>
          <div className="relative">
            <TextInput id="search" type="text" placeholder='Search by title...' value={query} onChange={((e) => setQuery(e.target.value))} />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
              {loading ? (
                <svg
                  className="h-5 w-5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 103.473 9.8l3.613 3.614a.75.75 0 101.06-1.06l-3.613-3.614A5.5 5.5 0 009 3.5zM5 9a4 4 0 118 0 4 4 0 01-8 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </span>
          </div>
        </div>
        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}


        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing, index) => (
            <ListingCard data={listing} key={index} />
          ))}

          {listings.length <= 0 && <p className="text-gray-400">No listings found</p>}
        </div>

      </div>
    </section>

  )
}
