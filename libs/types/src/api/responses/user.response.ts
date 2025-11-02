import { PublicUser, UserWithoutPassword } from "../../entities";
import { ApiResponse } from "../../utils/api-response";


/**
 * Success message as response for success,
 * else error
 */
export type UserCreatedResponse = ApiResponse<string>

/**
 * Return whole user's metadata after updated, excluding the password hash
 */
export type UserUpdatedResponse = ApiResponse<UserWithoutPassword>


/**
 * Response for requesting current's user data without password
 */
export type MeResponse = ApiResponse<UserWithoutPassword>

/**
 * Response for getting one user
  */
export type FindOneUserResponse = ApiResponse<PublicUser>

/**
 * Find multiple users, return the public data of user
  */
export type FindUsersResponse = ApiResponse<PublicUser[]>


