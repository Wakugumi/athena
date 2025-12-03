"use client";

import { useEffect, useState } from "react";
import ListingService from "@/api/ListingService";
import { PublicUser, type Listing } from "@athena/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { useDebounce } from "@/app/_utils/debounce.util";
import { formatMeta, formatPrice } from "./_utils/formatting.util";
import UserService from "@/api/UserService";
import { Avatar, Pagination } from "flowbite-react";
import { toSlug } from "@/app/_utils/slugify.util";
import { ListingCard } from "./_components/ListingCard";
import useQueryListings from "@/queries/useQueryListings";
import { useSearchParams } from "next/navigation";
import Loading from "@/app/loading";

export default function MarketPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const params = useSearchParams();

  const [popularUsers, setPopularUsers] = useState<PublicUser[]>([]);
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [page, setPage] = useState(1);

  const debouncedQuery = useDebounce(query, 300);

  const { data: listings, isLoading: listingsIsLoading } = useQueryListings({ page, limit: 6, title: debouncedQuery })

  useEffect(() => {
    if (params.get('q'))
      setQuery(decodeURIComponent(params.get('q')!))
  }, [params])

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const users = (await UserService.searchUsers(debouncedQuery));
        if (!cancelled) setUsers(users ?? [])

        const populars = (await UserService.searchUsers(""));
        if (!cancelled) setPopularUsers(users ?? [])
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
    <section className="bg-background min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">


        <div>
          <h1 className="text-foreground text-xl mb-4">Users</h1>
          <div className="flex flex-row overflow-x-auto gap-4">

            {popularUsers.map((user, index) => (<>

              <a key={index} href={`${user.username}/`}>
                <div className="flex flex-col items-center gap-2 justify-center">
                  <Avatar rounded img={user.avatar} />
                  <span className="text-foreground">{user.displayName}</span>
                </div>
              </a>
            </>))}

            {popularUsers.length <= 0 && <>No users found.</>}

          </div>
        </div>


        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {listingsIsLoading && <Loading />}

        <h1 className="text-foreground text-xl mb-4">Discover Notes and Knowledge</h1>
        {listings &&
          <div className="grid gap-4 grid-cols-2 grid-rows-2 md:grid-cols-3">

            {listings.data.map((listing) => (
              <a
                key={String(listing.id)}
                href={`/${listing.owner!.username}/${toSlug(listing.title)}?id=${listing.id}`}
                className="group transition hover:shadow-md"
              >
                <ListingCard data={listing} />
              </a>
            ))}
          </div>
        }

        {!loading && listings?.data.length === 0 && !error && (
          <p className="mt-4 text-sm text-gray-500">No listings found.</p>
        )}

        {listings?.data.length! > listings?.limit! &&
          <div className="flex overflow-x-auto sm:justify-center">
            <Pagination layout="navigation" currentPage={page} totalPages={listings?.total ?? 1} onPageChange={(x) => setPage(x)} />
          </div>
        }
      </div>
    </section>
  );
}
