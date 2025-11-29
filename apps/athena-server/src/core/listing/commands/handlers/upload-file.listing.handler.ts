import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UploadFileListingCommand } from "../upload-file-listing.command";
import { ListingService } from "../../services/listing.service";
import { Listing } from "../../entities/listing.entity";
import { UploadInstruction } from "@athena/types";

@CommandHandler(UploadFileListingCommand)
export class UploadFileListingHandler implements ICommandHandler<UploadFileListingCommand> {

  constructor(
    @InjectRepository(Listing) private readonly listingRepo: Repository<Listing>,
    private readonly listingService: ListingService) { }


  async execute(command: UploadFileListingCommand): Promise<UploadInstruction> {
    let existingListing: Listing | null;
    console.log('upload handler', command.listingId)

    /**
      * if listingId exist, then we assume the request is made to update existing draft
      */
    if (command.listingId)
      existingListing = await this.listingRepo.findOneBy(
        { id: command.listingId }
      );

    /**
      * except not given or not found, we assume they are creating new draft
      */
    else
      existingListing = await this.listingService.draftListing({
        ownerId: command.userId,
        title: "Listing baru"
      });


    const upload = await this.listingService.uploadFileForListing(
      {
        listingId: existingListing!.id,
        mimeType: command.contentType,
      }
    )


    await this.listingService.ensureUserOwnsListing(command.userId, existingListing!.id);

    await this.listingRepo.save(existingListing!)

    return upload

  }

}
