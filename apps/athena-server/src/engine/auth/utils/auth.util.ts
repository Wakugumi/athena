import { hashSync } from "bcrypt"

/**
 * 8 characters minimum
 * Must contain letters and numbers
 * Must contain at least one symbol
 */
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/


/**
 *  Only letters, numbers, underscores, and dots
 *  Must start with a letter
 *  Cannot have consecutive dots or underscores
 *  Must be 3–20 characters long
*/
export const USERNAME_REGEX = /^(?=.{3,20}$)(?!.*[_.]{2})[a-zA-Z][a-zA-Z0-9._]+$/

const saltRounds = 10
import * as bcrypt from 'bcrypt'

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, saltRounds);
}


export const compareHash = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
}
