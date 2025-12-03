import ListingService from "@/api/ListingService";
import { Listing } from "@athena/types";
import { useQuery } from '@tanstack/react-query'

interface Props {
  page: number;
  limit: number;
  sortBy?: keyof Listing;
  order?: "ASC" | "DESC";
  title?: string;
  seller?: string

}
export default function useQueryListings({ page = 1, limit = 6, sortBy, order = "ASC", title, seller }: Props) {
  return useQuery({
    queryKey: ['listings', page, limit, title, seller],
    queryFn: () => ListingService.getListings({ page, limit, order, sortBy }, title, seller),
  })

}
