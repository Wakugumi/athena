export interface CreateUserRequest {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    displayName?: string | null;
    avatar?: File | Buffer | string | Blob;
    bio?: string;
}
export interface UpdateProfileRequest {
    firstName?: string | null;
    lastName?: string | null;
    displayName?: string | null;
    bio?: string | null;
}
export interface UpdateAvatarRequest {
    blob: Blob | File | Base64URLString;
}
export interface UpdateUserAccountRequest {
    username?: string;
    email?: string;
    password?: string;
}
export interface FindOneUserQuery {
    id?: string;
    username?: string;
}
export interface FindUsersQuery {
    displayName?: string;
    username?: string;
}
