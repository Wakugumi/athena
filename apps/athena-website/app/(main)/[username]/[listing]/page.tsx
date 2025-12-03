"use client"
import ListingService from "@/api/ListingService";
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import { Listing } from "@athena/types";
import { getPagesPageStaticInfo } from "next/dist/build/analysis/get-page-static-info";
import { useParams, useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { MarkdownPreview } from "../../market/_components/MarkdownPreview";
import ProfileCard from "../_components/ProfileCard";
import { Badge, Button, Card, HR } from "flowbite-react";
import { HiDocument, HiStar } from "react-icons/hi";
import { HiWallet } from "react-icons/hi2"
import WalletCard from "../../_components/WalletCard";

enum PageState {
  LOADING,
  READY,
  ERROR,
}

export default function ListingPage() {

  const search = useSearchParams()
  const { username, listing: urlSlug } = useParams()
  const title = decodeURIComponent(urlSlug as string);
  const listingId = search.get('id')

  const [listing, setListing] = useState<Listing | null>(null);
  const [pageState, setPageState] = useState<PageState>(PageState.LOADING)
  const [error, setError] = useState("")

  useEffect(() => {

    (async () => {
      try {

        const data = await ListingService.getListing(listingId!)
        setListing(data!)
        setPageState(PageState.READY)
      } catch (error) {
        setPageState(PageState.ERROR)
        setError((error as any).response.data.message ?? "Error loading this listing")
        throw error;

      }
    })()
  }, [])

  if (pageState == PageState.LOADING)
    return <Loading />
  if (!listing)
    return <NotFound />

  return (
    <>

      {error && <div className="p-4 rounded-xl bg-red-700 text-red-100">{error}</div>}

      <div className="flex flex-col md:flex-row gap-8 text-foreground">



        <div className="md:w-[40%] min-h-[40vh] shadow-xl rounded-xl max-h-[60vh] overflow-y-scroll">
          <MarkdownPreview content={listing.preview ?? "No preview"} />
        </div>


        <div className="md:w-[30%] space-y-12">
          <div className="flex flex-col items-start gap-8">
            <h1 className="text-lg font-bold">{listing.title}</h1>

            <span className="text-primary font-bold text-2xl">{listing.currency} {listing.price}</span>
            <span className="flex items-center gap-4 text-lg"><HiDocument /> {listing.items?.length} File</span>
            <p>
              {listing.description}
            </p>


          </div>

          <a href={`/${username}`}>
            <ProfileCard data={listing.owner!} horizontal hideCTA />
          </a>


        </div>



        <div className="md:w-[30%] space-y-12">
          <Card className="rounded shadow bg-muted p-4 flex flex-col items-stretch gap-4">
            <WalletCard />
            <Button color="primary">Purchase</Button>
            <Button className="outline outline-primary text-foreground gap-1"><HiStar /> Star</Button>

          </Card>
        </div>


      </div>
    </>
  )

}
