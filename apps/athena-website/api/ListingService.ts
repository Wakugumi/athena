import { FindOneListingResponse, Listing, Visibility, type FindListingsResponse } from "@athena/types";
import api from "./api";
import { response } from "express";

export default class ListingService {
  static async getListings(title?: string, seller?: string) {
    const params = new URLSearchParams();
    if (title) {
      params.append('title', title);
    }
    if (seller) {
      params.append('seller', seller);
    }
    return await api.get<FindListingsResponse>('/listing?' + params.toString())
      .then((response) => {
        return response.data;
      })
      .catch(error => {
        throw error;
      });
  }

  static async getListing(id: string | number) {
    return await api.get<FindOneListingResponse>('/listing/' + id)
      .then((response) => {
        return response.data;
      })
      .catch(error => {
        throw error;
      });
  }

  static async getMyDraft(title?: string, visibility?: Visibility) {
    return await api.get<FindListingsResponse>('/listing/draft')
      .then(response => {
        return response.data
      }).catch(error => {
        throw error
      })
  }
}
