import { UUID } from "crypto";
import { Role } from "./role";

export type User = {


  // standard fields;
  id: string | UUID;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;


  // domain specific fields
  username: string;
  displayName: string;
  role: Role;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  avatar: string;
  bio: string;
}

export type CreateUser = Pick<User, "username" | "role" | "firstName" | "lastName" | "email" | "avatar" | "bio" | "displayName"> & {
  password: string;
}

export type PublicUser = Pick<User, "username" | "firstName" | "lastName" | "email" | "avatar" | 'bio' | "displayName">;


export type UpdateUser = Omit<User, "createdAt" | "id" | "deletedAt">
