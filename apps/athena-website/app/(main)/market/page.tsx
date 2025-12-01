"use client";

import { useEffect, useState } from "react";
import ListingService from "@/api/ListingService";
import type { Listing } from "@athena/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { useDebounce } from "@/app/_utils/debounce.util";
import { formatMeta, formatPrice } from "./_utils/formatting.util";

export default function MarketPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const data = (await ListingService.getListings(
          debouncedQuery || undefined,
          undefined
        )).data;
        if (!cancelled) setListings(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to fetch listings");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  return (
    <section className="bg-background min-h-[70vh]">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <label htmlFor="search" className="sr-only">
            Search listings
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              placeholder="Search listings by title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 pr-10 text-sm shadow-sm focus:border-gray-400 focus:outline-none"
            />
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
          {listings.map((listing) => (
            <a
              key={String(listing.id)}
              href={`/market/${listing.id}`}
              className="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary-600">
                    {listing.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {formatMeta(listing)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatPrice(listing)}
                  </p>
                  {typeof listing.downloads === "number" && (
                    <p className="text-xs text-gray-500">{listing.downloads} downloads</p>
                  )}
                </div>
              </div>
              <div className="prose prose-sm mt-3 max-w-none line-clamp-5 text-gray-600">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                  {listing.preview?.trim() || listing.summary || ""}
                </ReactMarkdown>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>Items: {listing.items?.length ?? 0}</span>
                <span className="inline-flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 15.707a1 1 0 01-1.414 0l-5.586-5.586a1 1 0 011.414-1.414L9 13.586V3a1 1 0 112 0v10.586l4.293-4.293a1 1 0 111.414 1.414l-5.586 5.586z"
                      clipRule="evenodd"
                    />
                  </svg>
                  View & Purchase
                </span>
              </div>
            </a>
          ))}
        </div>
        {!loading && listings.length === 0 && !error && (
          <p className="mt-4 text-sm text-gray-500">No listings found.</p>
        )}
      </div>
    </section>
  );
}
