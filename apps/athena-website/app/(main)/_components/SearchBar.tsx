import { useDebounce } from "@/app/_utils/debounce.util";
import { toSlug } from "@/app/_utils/slugify.util";
import useQueryListings from "@/queries/useQueryListings";
import { TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HiSearch } from "react-icons/hi";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  const [open, setOpen] = useState(false);
  const debounceQuery = useDebounce(query, 300)
  const { data, isLoading } = useQueryListings({ page: 1, limit: 6, title: debounceQuery })
  const router = useRouter()

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);


  // close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (<>
    <form onSubmit={(e) => {
      e.preventDefault();

      router.push('/market?q=' + toSlug(query))

    }}>
      <div>
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

          </span>
        </div>
      </div>


    </form>


  </>)

}
