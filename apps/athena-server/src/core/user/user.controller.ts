import { PublicUser, User, } from "@athena/types";
import { Body, Controller, Get, Param, Patch, Put, Request, Scope, UnauthorizedException, UseGuards } from "@nestjs/common";
import { UserProfileService } from "./services/user-profile.service";
import { Request as ReqContext } from "express";
import { UpdateProfileDTO } from "./dtos/update-profile.dto";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/engine/auth/guards/auth-jwt.guard";
import { CurrentUser } from "src/engine/auth/decorators/current-user.decorator";
import { Public } from "src/engine/auth/decorators/public-guard.decorator";

@Controller({ scope: Scope.REQUEST, path: 'user' })
@UseGuards(JwtAuthGuard)
export class UserController {

  constructor(private profileService: UserProfileService) { }

  @Get('profile/:id')
  @Public()
  async getProfile(@Param('id') userId: string) {
    return await this.profileService.getPublicUser(userId)

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

}
