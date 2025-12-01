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



import { ID } from "../common";
import { Listing } from "./listing.entity";

export interface User {


  // standard fields;
  id: ID
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;


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
  bio?: string | null;

  /**
  * publicly available only listings.
  * hydrated on several queries.
  */
  listings?: Listing[] | null;
}

export type PublicUser = Pick<User, "id" | "displayName" | "avatar" | "bio" | "createdAt" | "username" | "listings">

export type UserWithoutPassword = Omit<User, "passwordHash">
