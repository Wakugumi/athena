
export class ListingItemReadyEvent {
  constructor(
    public readonly listingId: string,
    public readonly listingItemId: string,
  ) { }
}
