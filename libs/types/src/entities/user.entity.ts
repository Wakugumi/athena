/**
 * Athena
 * Shared Type library
 * ================================
 * User Model — Shared Type System
 * ================================
 *
 * Log:
 * - 26 October 2025, Ananda Risyad
 * - 31 October 2025, Ananda Risyad, add docs and set optional params
 */



import { UUID } from "crypto";

export interface User {


  // standard fields;
  id: string | UUID;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;


  // domain specific fields
  username: string;
  displayName: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;

  /**
   * contains public url
  *  this value will mostly be used directly in <img> tag
    */
  avatar: string;
  bio?: string | null
}

export type PublicUser = Pick<User, "id" | "displayName" | "avatar" | "bio">

export type UserWithoutPassword = Omit<User, "passwordHash">
