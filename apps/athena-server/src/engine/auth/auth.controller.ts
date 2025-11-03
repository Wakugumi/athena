import { Controller, Post, UseGuards, Request, Get, Body, UseFilters, UsePipes, ValidationPipe, Headers } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { LocalAuthGuard } from "./guards/auth-local.guard";
import { Request as RequestContext } from "express";
import { JwtAuthGuard } from "./guards/auth-jwt.guard";
import { SignupPayload } from "./dtos/signup.input";
import { SignupService } from "./services/signup.service";
import { CustomExceptionFilter } from "src/utils/exception.filter";
import { User } from "src/core/user/user.entity";
import { LoginPayload } from "./dtos/login.input";
import { ApiBearerAuth, ApiBody, ApiHeader, ApiHeaders, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthRoutes } from '@athena/routes'



@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService, private signupService: SignupService) {

  }


  @Post(AuthRoutes.LOGIN)
  @UsePipes(new ValidationPipe())
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ 'summary': 'user login with username and password' })
  @ApiBody({ type: LoginPayload })
  async login(@Body() _: LoginPayload, @Request() req: RequestContext) {

    return this.authService.login(req.user as User)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(AuthRoutes.ME)
  async me(@Request() req: RequestContext) {
    return req.user

  }

  @Post(AuthRoutes.SIGNUP)
  @UsePipes(new ValidationPipe())
  async signup(@Body() payload: SignupPayload) {
    return this.signupService.signup(payload)

  }

  @ApiBearerAuth()
  @ApiHeaders([])
  @Post(AuthRoutes.LOGOUT)
  async logout(@Request() req: RequestContext, @Headers('authorization') authorization?: string): Promise<{ success: boolean }> {
    if (!authorization) return { success: false }
    const token = authorization.slice(7)
    await this.authService.logout(token);
    return { success: true }
  }

}
