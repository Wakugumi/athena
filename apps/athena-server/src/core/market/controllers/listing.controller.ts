import { Body, Controller, Get, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { SearchListingQuery } from "../queries/search-listing.query";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, PartialType } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/engine/auth/guards/auth-jwt.guard";
import { CreateDraftListingCommand } from "../commands/create-draft-listing.command";
import { CurrentUser } from "src/engine/auth/decorators/current-user.decorator";
import { User } from "src/core/user/user.entity";
import { Listing } from "../entities/listing.entity";
import { UpdateDraftListingDto } from "../dtos/update-listing.dto";
import { UpdateDraftListingCommand } from "../commands/update-draft-listing.command";
import { PublishListingRequest } from "@athena/types";
import { PublishListingCommand } from "../commands/publish-listing.command";
import { UploadFileDraftListingDTO } from "../dtos/upload-file-draft-listing.dto";
import { UploadFileListingCommand } from "../commands/upload-file-listing.command";

@Controller('listing')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe())
export class ListingController {

  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) { }

  @Get()
  @ApiBearerAuth()
  @ApiQuery({ name: 'title', type: "string", description: 'search by title of the listing', required: false })
  @ApiQuery({ name: 'seller', type: "string", description: 'search by username or first name and last name of the seller', required: false })
  @ApiQuery({ name: 'min_price', type: 'number', description: 'minimum price range', required: false })
  @ApiQuery({ name: 'max_price', type: 'number', description: 'maximum price range', required: false })
  async search(@Query('title') title: string, @Query('seller') seller: string, @Query('min_price') minPrice: number, @Query('max_price') maxPrice: number) {
    return await this.queryBus.execute<SearchListingQuery>(
      new SearchListingQuery(title, seller, minPrice, maxPrice)
    )
  }


  @Post('draft')
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Request to create new draft", description: "Request create draft listing, will create new record of Listing marked as draft, then return as response"
  })
  async draft(@CurrentUser() user: User): Promise<Partial<Listing>> {
    return await this.commandBus.execute<CreateDraftListingCommand>(
      new CreateDraftListingCommand(user.id)
    )
  }


  @Put('draft')
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update draft", description: "Update listing draft" })
  async updateDraft(@CurrentUser() user: User, @Body() payload: UpdateDraftListingDto): Promise<Partial<Listing>> {
    return await this.commandBus.execute<UpdateDraftListingCommand>(
      new UpdateDraftListingCommand(payload.id, user.id, payload as Partial<Omit<Listing, "id">>)

    )
  }

  @Post('draft/upload')
  async uploadFile(@CurrentUser() user: User, @Body() payload: UploadFileDraftListingDTO): Promise<{ key: string, url: string }> {
    return await this.commandBus.execute<UploadFileListingCommand>(
      new UploadFileListingCommand(user.id, payload.contentType, payload.size, payload.listingId)
    )

  }

  @Post('publish')
  @ApiBearerAuth()
  async publish(@CurrentUser() user: User, @Body() payload: PublishListingRequest): Promise<Partial<Listing>> {
    return await this.commandBus.execute<PublishListingCommand>
      (
        new PublishListingCommand(user.id, payload.id)
      )

  }


}
