import ListingService from "@/api/ListingService";
import { Listing } from "@athena/types";
import { useQuery } from "@tanstack/react-query";

interface Props {
  page: number;
  limit: number;
  sortBy?: keyof Listing;
  order?: "ASC" | "DESC";
  title?: string;

}
export default function useQueryDrafts({ page = 1, limit = 6, sortBy, order = "ASC", title }: Props) {
  return useQuery({
    queryKey: ['drafts', page, limit, title],
    queryFn: () => ListingService.getMyDrafts({ page, limit, order, sortBy }, title),
  })

}
