
export class ListingItemAddedEvent {
  constructor(
    public readonly listingId: string,
    public readonly listingItemId: string,
  ) { }
}
