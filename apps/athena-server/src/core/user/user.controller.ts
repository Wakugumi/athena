import { UserRoutes } from "@athena/routes";
import { PublicUser, UpdateProfileRequest, User, UserUpdatedResponse } from "@athena/types";
import { Body, Controller, Put, Request, UnauthorizedException, UseGuards } from "@nestjs/common";
import { UserProfileService } from "./services/user-profile.service";
import { Request as ReqContext } from "express";
import { UpdateProfileDTO } from "./dtos/update-profile.dto";
import { ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/engine/auth/guards/auth-jwt.guard";

@Controller()
export class UserController {

  constructor(private profileService: UserProfileService) { }

  @ApiBody({ type: UpdateProfileDTO })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(UserRoutes.PROFILE)
  async updateProfile(@Request() req: ReqContext, @Body() dto: UpdateProfileDTO): Promise<PublicUser> {
    console.log(req.user)
    if (!req.user) throw new UnauthorizedException("Auth token invalid or undefined")
    return await this.profileService.updateProfile((req.user as User).id, dto)

  }

}
