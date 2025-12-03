import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, Patch, Post, Put, Query, UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, PartialType } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/engine/auth/guards/auth-jwt.guard";
import { CurrentUser } from "src/engine/auth/decorators/current-user.decorator";
import { User } from "src/core/user/user.entity";
import { Listing } from "./entities/listing.entity";
import { Public } from "src/engine/auth/decorators/public-guard.decorator";
import { SearchListingQuery } from "./queries/search-listing.query";
import { FetchListingsQuery } from "./queries/fetch-listings.query";
import { ListingStatus, UploadInstruction, Visibility } from "@athena/types";
import { DraftListingCommand } from "./commands/draft-listing.command";
import { UpdateDraftListingDto } from "../market/dtos/update-listing.dto";
import { UpdateDraftListingCommand } from "./commands/update-draft-listing.command";
import { UploadFileDraftListingDTO } from "../market/dtos/upload-file-draft-listing.dto";
import { UploadFileListingCommand } from "./commands/upload-file-listing.command";
import { PublishListingDto } from "../market/dtos/publish-listing.dto";
import { PublishListingCommand } from "./commands/publish-listing.command";
import { FetchListingResponseDTO } from "../market/dtos/fetch-listing.output";
import { CustomExceptionFilter } from "src/utils/exception.filter";
import { HttpStatusCode } from "axios";
import { ApiResponseDto } from "src/utils/api-response-wrapper.util";
import { DeleteDraftListingCommand } from "./commands/delete-draft-listing.command";
import { TakedownListingCommand } from "./commands/takedown-listing.command";
import { FetchListingsResponseDTO } from "../market/dtos/fetch-listings.output";
import { PagingOptionsDto } from "src/common/dtos/paging-options.dto";
import { FetchDraftQuery } from "./queries/fetch-draft.query";
import { FetchListingQuery } from "./queries/fetch-listing.query";

@Controller('listing')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe())
@UseFilters(new CustomExceptionFilter())
export class ListingController {

  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) { }

  @Get()
  @Public()
  @ApiOperation({ description: "query all (search) listings, only returns public view of published listing" })
  @ApiQuery({ name: 'title', type: "string", description: 'search by title of the listing', required: false })
  @ApiQuery({ name: 'seller', type: "string", description: 'search by username or first name and last name of the seller', required: false })
  @ApiQuery({ name: 'min_price', type: 'number', description: 'minimum price range', required: false })
  @ApiQuery({ name: 'max_price', type: 'number', description: 'maximum price range', required: false })
  async search(@Query() paging: PagingOptionsDto, @Query('title') title: string, @Query('seller') seller: string, @Query('min_price') minPrice: number, @Query('max_price') maxPrice: number) {
    return await this.queryBus.execute<SearchListingQuery>(
      new SearchListingQuery(paging, title, seller, minPrice, maxPrice)
    )
  }


  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({ type: FetchListingsResponseDTO })
  @ApiQuery({ name: 'q', type: 'string', required: false })
  @ApiQuery({ name: 'visibility', type: 'enum', enum: Visibility, required: false })
  async me(@CurrentUser() user: User, @Query() paging: PagingOptionsDto, @Query("q") query?: string, @Query('visibility') visibility?: Visibility) {
    return await this.queryBus.execute<FetchListingsQuery>(
      new FetchListingsQuery(paging, user.id, undefined, query ?? undefined, visibility ?? undefined, undefined)
    )

  }

  @Get('draft')
  @ApiBearerAuth()
  @ApiOperation(
    {
      summary: "Fetch all user's draft",
      description: "Fetch user's drafts"
    }
  )
  async getDrafts(@CurrentUser() user: User, @Query() paging: PagingOptionsDto, @Query('q') query?: string) {
    return await this.queryBus.execute<FetchListingsQuery>(
      new FetchListingsQuery(paging, user.id, undefined, query ?? undefined, Visibility.DRAFT, undefined)
    )
  }


  @Get('draft/:id')
  @ApiBearerAuth()
  @ApiOperation(
    {
      summary: "Fetch a single draft",
    }
  )
  async getDraft(@CurrentUser() user: User, @Param('id') listingId: string): Promise<Listing> {
    return await this.queryBus.execute<FetchDraftQuery>(
      new FetchDraftQuery(listingId, user.id)
    )
  }



  @Post('draft')
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Request to create new draft", description: "Request create draft listing, will create new record of Listing marked as draft, then return as response"
  })
  async draft(@CurrentUser() user: User): Promise<Partial<Listing>> {
    return await this.commandBus.execute<DraftListingCommand>(
      new DraftListingCommand(user.id)
    )
  }


  @Patch('draft')
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update draft", description: "Update listing draft" })
  async updateDraft(@CurrentUser() user: User, @Body() payload: UpdateDraftListingDto): Promise<Partial<Listing>> {
    return await this.commandBus.execute<UpdateDraftListingCommand>(
      new UpdateDraftListingCommand(payload.id, user.id, payload as Partial<Omit<Listing, "id">>)

    )
  }

  @Delete('draft/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete draft" })
  async deleteDraft(@CurrentUser() user: User, @Param("id") listingId: string) {
    return await this.commandBus.execute<DeleteDraftListingCommand>(
      new DeleteDraftListingCommand(listingId, user.id)
    )

  }


  @Post('draft/upload')
  @ApiBody({ type: UploadFileDraftListingDTO })
  @ApiBearerAuth()
  async uploadFile(@CurrentUser() user: User, @Body() payload: UploadFileDraftListingDTO): Promise<UploadInstruction> {
    return await this.commandBus.execute<UploadFileListingCommand>(
      new UploadFileListingCommand(user.id, payload.contentType, payload.listingId)
    )

  }

  @Post('publish')
  @ApiBody({ type: PublishListingDto })
  @ApiOkResponse({ type: ApiResponseDto<Partial<Listing>> })
  @ApiBearerAuth()
  async publish(@CurrentUser() user: User, @Body() payload: PublishListingDto): Promise<Partial<Listing>> {
    return await this.commandBus.execute<PublishListingCommand>
      (
        new PublishListingCommand(user.id, payload.id)
      )
  }

  @Post('takedown/:id')
  @ApiOkResponse({ type: ApiResponseDto<Listing> })
  @ApiBearerAuth()
  async takedown(@CurrentUser() user: User, @Param('id') listingId: string) {
    return await this.commandBus.execute<TakedownListingCommand>(
      new TakedownListingCommand(user.id, listingId)
    )
  }


  @Get(':id')
  @Public()
  @ApiBearerAuth()
  @ApiParam({ name: "id", description: "Listing Id" })
  @ApiOperation({ description: "Fetch a detailed PUBLISHED listing only, with Private or Public visibility" })
  @ApiOkResponse({ type: FetchListingResponseDTO })
  async get(@Param('id') listingId: string) {
    return await this.queryBus.execute<FetchListingQuery>(
      new FetchListingQuery(listingId,)
    )

  }


}
