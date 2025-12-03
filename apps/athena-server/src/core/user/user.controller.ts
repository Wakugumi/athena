import { ContentTypes, PublicUser, User, } from "@athena/types";
import { Body, Controller, Get, Param, Patch, Post, Put, Query, Request, Scope, UnauthorizedException, UseGuards } from "@nestjs/common";
import { UserProfileService } from "./services/user-profile.service";
import { Request as ReqContext } from "express";
import { UpdateProfileDTO } from "./dtos/update-profile.dto";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/engine/auth/guards/auth-jwt.guard";
import { CurrentUser } from "src/engine/auth/decorators/current-user.decorator";
import { Public } from "src/engine/auth/decorators/public-guard.decorator";
import { UpdateAvatarRequestDto } from "./dtos/update-avatar.dto";

@Controller({ scope: Scope.REQUEST, path: 'user' })
@UseGuards(JwtAuthGuard)
export class UserController {

  constructor(private profileService: UserProfileService) { }

  @Get('profile/:username')
  @Public()
  async getProfile(@Param('username') username: string): Promise<PublicUser | null> {
    return await this.profileService.getPublicUser(username)

  }

  @ApiBody({ type: UpdateProfileDTO })
  @ApiBearerAuth()
  @ApiOperation({ description: "Update profile" })
  @Patch('profile')
  async updateProfile(@Request() req: ReqContext, @Body() dto: UpdateProfileDTO): Promise<PublicUser> {
    console.log(req.user)
    if (!req.user) throw new UnauthorizedException("Auth token invalid or undefined")
    return await this.profileService.updateProfile((req.user as User).id, dto)

  }


  @Get("me")
  @ApiBearerAuth()
  @ApiOperation({ description: "Fetch the current user with fresh data. Can be used for checking token's validity" })
  async me(@CurrentUser() user: User) {
    return await this.profileService.getUser(user.id)
  }


  @Get('search')
  @Public()
  @ApiQuery({ name: 'q', required: false })
  async search(@Query("q") query: string) {
    return await this.profileService.searchUser(query ?? "")

  }


  @Post('avatar')
  @ApiBearerAuth()
  @ApiBody({ type: UpdateAvatarRequestDto })
  async avatar(@CurrentUser() user: User, @Body() payload: UpdateAvatarRequestDto) {
    return await this.profileService.updateAvatar(user.id, payload.contentType)
  }

}
