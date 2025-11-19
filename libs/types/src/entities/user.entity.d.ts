import { UUID } from "crypto";
export interface User {
    id: string | UUID;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
    username: string;
    displayName: string;
    email: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
    avatar: string;
    bio?: string | null;
}
export type PublicUser = Pick<User, "id" | "displayName" | "avatar" | "bio">;
export type UserWithoutPassword = Omit<User, "passwordHash">;
