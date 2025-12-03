import ListingService from "@/api/ListingService";
import { Listing } from "@athena/types";
import { useMutation } from "@tanstack/react-query";

export default function useMutatePublish({ onSettled }: { onSettled: (data: Partial<Listing>) => void }) {
  return useMutation({
    mutationKey: ["publish"],
    mutationFn: (listingId: string) => ListingService.publishListing(listingId),
    onSettled: (data) => { onSettled(data!) }

  })
}
