import { User, UserWithoutPassword } from "../../entities";


/**
 * Request for signup body payload
 */
export interface CreateUserRequest {
  username: string;
  email: string,
  firstName: string,
  lastName: string,


  // Optional properties for this request
  // Backend handle this in different procedure (e.g. update public profile)
  displayName?: string | null;
  /**
  * Direct upload image's content
  */
  avatar?: File | Buffer | string | Blob;
  bio?: string;

}

/**
 * Request or updating user's public data
  */
export interface UpdateProfileRequest {
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  bio?: string | null
}

export interface UpdateAvatarRequest {
  blob: Blob | File | Base64URLString;
}

/**
 * Request for updating user's private data
 */
export interface UpdateUserAccountRequest {
  username?: string;
  email?: string;
  password?: string
}




export interface FindOneUserQuery {
  id?: string;
  username?: string;
}

export interface FindUsersQuery {
  displayName?: string;
  username?: string

}
