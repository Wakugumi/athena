import { ContentTypes, CreatedDraftListingResponse, FindOneListingResponse, Listing, Paginated, PaginationQuery, PublishedListingResponse, UpdatedListingResponse, UpdateListingRequest, UploadFileDraftListingRequest, UploadFileListingResponse, Visibility, type FindListingsResponse } from "@athena/types";
import api from "./api";
import { response } from "express";

export default class ListingService {
  static async getListings(paginate: PaginationQuery, title?: string, seller?: string): Promise<Paginated<Listing> | undefined> {
    const params = new URLSearchParams()
    if (paginate.page)
      params.append("page", paginate.page.toString());
    if (paginate.limit)
      params.append("limit", paginate.limit.toString());
    if (paginate.sortBy)
      params.append("sortBy", paginate.sortBy)
    if (paginate.order)
      params.append("order", paginate.order)

    if (title) {
      params.append('title', title);
    }

    if (seller)
      params.append('seller', seller)
    return await api.get<FindListingsResponse>('/listing?' + params.toString())
      .then((response) => {

        return response.data.data
      })
      .catch(error => {
        throw error;
      });
  }

  static async getListing(id: string | number) {
    return await api.get<FindOneListingResponse>('/listing/' + id)
      .then((response) => {
        return response.data.data;
      })
      .catch(error => {
        throw error;
      });
  }

  static async getMyDrafts(paginate: PaginationQuery, query?: string) {
    const params = new URLSearchParams()
    if (paginate.page)
      params.append("page", paginate.page.toString());
    if (paginate.limit)
      params.append("limit", paginate.limit.toString());
    if (paginate.sortBy)
      params.append("sortBy", paginate.sortBy)
    if (paginate.order)
      params.append("order", paginate.order)

    if (query)
      params.append('q', query)


    return await api.get<FindListingsResponse>('/listing/draft?' + params.toString())
      .then(response => {
        console.log("ListingService", response.data.data)
        return response.data.data
      }).catch(error => {
        throw error
      })
  }

  static async getMyDraft(id: string) {
    return await api.get<FindOneListingResponse>('/listing/draft/' + id)
      .then(response => {
        return response.data.data
      }).catch(error => {
        throw error
      })

  }

  static async getMyListings(paginate: PaginationQuery, query?: string) {
    const params = new URLSearchParams()
    if (paginate.page)
      params.append("page", paginate.page.toString());
    if (paginate.limit)
      params.append("limit", paginate.limit.toString());
    if (paginate.sortBy)
      params.append("sortBy", paginate.sortBy)
    if (paginate.order)
      params.append("order", paginate.order)

    if (query)
      params.append('q', query)


    return await api.get<FindListingsResponse>(`/listing/me?${params.toString()}`)
      .then(response => {

        return response.data.data
      }).catch(error => {
        throw error;
      })
  }


  static async createDraft() {
    return await api.post<CreatedDraftListingResponse>(`listing/draft`)
      .then(response => {
        return response.data.data
      }).catch(error => {
        throw error
      })
  }

  static async updateDraft(payload: UpdateListingRequest) {
    return await api.patch<UpdatedListingResponse>('listing/draft', payload)
      .then(response => {
        return response.data.data
      }).catch(error => {
        throw error
      })

  }


  static async uploadItem(contentType: ContentTypes, listingId?: string) {
    return await api.post<UploadFileListingResponse>("listing/draft/upload", { contentType, listingId })

      .then(response => { return response.data.data })
      .catch(error => {
        throw error
      })
  }

  static async publishListing(listingId: string) {
    return await api.post<PublishedListingResponse>('listing/publish', { id: listingId })
      .then(res => { return res.data.data })
      .catch(error => {
        throw error;
      })
  }
}
