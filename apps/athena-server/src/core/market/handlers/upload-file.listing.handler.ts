import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UploadFileListingCommand } from "../commands/upload-file-listing.command";
import { Listing } from "../entities/listing.entity";
import { ListingService } from "../services/listing.service";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";


@CommandHandler(UploadFileListingCommand)
export class UploadFileListingHandler implements ICommandHandler<UploadFileListingCommand> {

  constructor(
    @InjectRepository(Listing) private readonly listingRepo: Repository<Listing>,
    private readonly listingService: ListingService) { }


  async execute(command: UploadFileListingCommand): Promise<{ key: string, url: string, }> {
    let existingListing: Listing | undefined;

    /**
      * if listingId exist, then we assume the request is made to update existing draft
      */
    if (command.listingId)
      existingListing = await this.listingRepo.preload(
        { id: command.listingId }
      );


    /**
      * except not given or not found, we assume they are creating new draft
      */
    if (!existingListing)
      existingListing = await this.listingService.draftListing({
        sellerId: command.userId,
        title: "Listing baru"
      });


    /**
      * as more uplaod coming in, update the expected items
        */
    existingListing.itemsExpectedCount += 1



    await this.listingService.ensureUserOwnsListing(command.userId, existingListing.id);

    await this.listingRepo.save(existingListing)

    return await this.listingService.uploadFileForListing(
      {
        listingId: existingListing.id,
        mimeType: command.contentType,
        size: command.size,
        originalFilename: command.originalFilename
      }
    )





  }

}
