import { UserWithoutPassword } from "../../entities";
import { ApiResponse } from "../../utils";

export type LoginResponse = ApiResponse<{
  access_token: string,
  expires_in: string
}>
export type SignupResponse = ApiResponse<string>;

export type LogoutResponse = ApiResponse<{
  success: boolean
}>

export type MeResponse = ApiResponse<UserWithoutPassword>
