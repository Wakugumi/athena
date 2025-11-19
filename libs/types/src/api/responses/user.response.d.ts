import { PublicUser, UserWithoutPassword } from "../../entities";
import { ApiResponse } from "../../utils/api-response";
export type UserCreatedResponse = ApiResponse<string>;
export type UserUpdatedResponse = ApiResponse<UserWithoutPassword>;
export type FindOneUserResponse = ApiResponse<PublicUser>;
export type FindUsersResponse = ApiResponse<PublicUser[]>;
