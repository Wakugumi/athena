"use client";
import ListingService from "@/api/ListingService";
import { useDebounce } from "@/app/_utils/debounce.util";
import { useAuth } from "@/context/AuthContext";
import { Listing, Visibility } from "@athena/types";
import { Avatar, Badge, Button, Dropdown, DropdownItem, HR, Pagination, TextInput } from "flowbite-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { HiBookOpen, HiCheck, HiDocumentAdd, HiDownload, HiEmojiSad, HiPlus } from "react-icons/hi";
import { formatDate, formatMeta } from "../../market/_utils/formatting.util";
import Link from "next/link";
import { toSlug } from "@/app/_utils/slugify.util";
import { useQuery } from "@tanstack/react-query";
import useQueryListings from "@/queries/useQueryListings";

enum sortOptions {
  CREATED = "createdAt",
  UPDATED = 'updatedAt',
  DOWNLOADS = "downloads",
}



function generateListingLink(list: Listing, username: string) {
  if (list.visibility == Visibility.DRAFT)
    return `/${username}/draft/${toSlug(list.title)}?id=${list.id}`


  return `/${username}/${toSlug(list.title)}?id=${list.id}`

}


export default function UserListings() {
  const [query, setQuery] = useState("");
  const { username } = useParams();
  const { isAuth, user } = useAuth()
  const params = useSearchParams();
  const sort = params.get('sort')
  const order = params.get('order') as any
  const router = useRouter()
  const [page, setPage] = useState(1)

  const debounceQuery = useDebounce(query, 300);
  const listingsQuery = useQueryListings({ page, limit: 6, sortBy: sort as keyof Listing, order: order!, title: debounceQuery, seller: username as string })
  const listings = listingsQuery.data;

  const setSort = (value: sortOptions) => {

    const param = new URLSearchParams(params.toString())
    param.set("sort", value);
    router.push(`?${param.toString()}`)
  }

  const setOrder = (value: "ASC" | "DESC") => {
    const param = new URLSearchParams(params.toString())
    param.set("order", value);
    router.push(`?${param.toString()}`)

  }




  return (


    <div className="flex flex-col items-stretch gap-8">
      <div className="flex md:flex-row flex-wrap items-stretch w-full gap-4">
        <TextInput color="primary" className="flex-1 min-w-full" placeholder="Search by title..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <Dropdown color="primary" label={order == "ASC" ? "Ascending" : "Descending"}>
          <DropdownItem onClick={() => setOrder("ASC")}>Ascending</DropdownItem>

          <DropdownItem onClick={() => setOrder("DESC")}>Descending</DropdownItem>
        </Dropdown>
        <Dropdown color="primary" label="Sort By">
          {
            Object.values(sortOptions).map((value, index) => (
              <DropdownItem onClick={() => setSort(value)} key={index}>{value.toString()}</DropdownItem>
            ))
          }
        </Dropdown>
      </div>

      {listings?.data.length! <= 0 &&
        <div className="w-full flex flex-col items-center content-center gap-4">
          <Avatar bordered={false} size="xl" img={(_) => (<HiEmojiSad size="12rem" className="text-shadow-foreground opacity-50" />)} />
          {isAuth() ? <p>You have no listing yet.</p> : <p>This user has no listing yet.</p>}
        </div>}


      <div className="flex-col gap-2 items-stretch">
        {listings?.data.map((list, index) => (

          <div key={index}>

            <div className="flex flex-row content-between items-center">
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center gap-2">
                  <Link className="text-xl font-bold text-blue-400" href={generateListingLink(list, username as string)}>{list.title}</Link>
                  <Badge color="gray" size="md">{list.visibility}</Badge>

                </div>
                <span className="text-gray-400 text-sm flex items-center"><HiDownload className="mr-2" /> {list.downloads} | Last updated at {formatDate(list.updatedAt)}</span>
              </div>
              <div></div>
            </div>
            <HR />

          </div>
        ))}
      </div>

      {listings?.total! > listings?.limit! &&
        <Pagination currentPage={page} onPageChange={(x) => setPage(x)} totalPages={listings?.total! / listings?.limit!} />
      }
    </div>
  )
}
