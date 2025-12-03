import { useDebounce } from "@/app/_utils/debounce.util";
import { toSlug } from "@/app/_utils/slugify.util";
import { useAuth } from "@/context/AuthContext";
import useQueryDrafts from "@/queries/useQueryDrafts";
import { Listing, Visibility } from "@athena/types";
import { Avatar, Badge, Button, HR, Pagination, TextInput } from "flowbite-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiDownload, HiEmojiHappy, HiPlus } from "react-icons/hi";
import { formatDate } from "../../market/_utils/formatting.util";
import { useMutation, useQuery } from "@tanstack/react-query";
import ListingService from "@/api/ListingService";
import Loading from "@/app/loading";



function generateListingLink(list: Listing, username: string) {
  if (list.visibility == Visibility.DRAFT)
    return `/${username}/draft/${toSlug(list.title)}?id=${list.id}`


  return `/${username}/${toSlug(list.title)}?id=${list.id}`

}
export default function UserDrafts() {

  const mutation = useMutation({
    mutationFn: () => ListingService.createDraft(),
  })

  const [page, setPage] = useState(1);

  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 300)

  const drafts = useQueryDrafts({ page: page, limit: 3, sortBy: "updatedAt", order: "DESC", title: debounceQuery });
  const datas = drafts.data

  useEffect(() => {
    console.log(datas)
  }, [datas])



  return (<>
    <div className="flex flex-col items-stretch gap-8">

      <div className="flex md:flex-row flex-wrap items-stretch w-full gap-4">

        <TextInput color="primary" className="flex-1" placeholder="Search by title..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button color="primary" onClick={() => { mutation.mutate() }}><HiPlus size={18} className="mr-4" />New</Button>


      </div>

      {drafts.data?.data?.length! <= 0 &&
        <div className="w-full flex flex-col items-center content-center gap-4">
          <Avatar bordered={false} size="xl" img={(_) => (<HiEmojiHappy size="12rem" className="text-shadow-foreground opacity-50" />)} />
          <p>You have no drafts</p>
        </div>}



      {drafts.isLoading && <Loading />}
      {datas?.data && <div className="flex-col gap-2 items-stretch">
        {datas?.data?.map((list, index) => (

          <div key={index}>

            <div className="flex flex-row content-between items-center">
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center gap-2">
                  <Link className="text-xl font-bold text-blue-400" href={generateListingLink(list, list.owner?.username!)}>{list.title}</Link>
                  <Badge color="gray" size="md">{list.visibility}</Badge>

                </div>
                <span className="text-gray-400 text-sm flex items-center"><HiDownload className="mr-2" /> {list.downloads} | Last updated at {formatDate(list.updatedAt)}</span>
              </div>
              <div></div>
            </div>
            <HR />

          </div>
        ))}
      </div>}

      {drafts.data?.total! > drafts.data?.limit! &&
        <Pagination color="primary" currentPage={page} onPageChange={(x) => setPage(x)} totalPages={drafts.data?.total!} />
      }
    </div>

  </>)
}
