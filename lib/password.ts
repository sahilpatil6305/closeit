import bcrypt from "bcryptjs";
import { BCRYPT_COST } from "@/lib/constants";

/**
 * Hashes a plaintext password using bcrypt.
 * @param password Plaintext password to hash
 * @returns Promise resolving to the hashed password string
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, BCRYPT_COST);
}

/**
 * Compares a plaintext password against a stored bcrypt hash.
 * @param password Plaintext password to verify
 * @param hash Stored bcrypt hash
 * @returns Promise resolving to true if password matches hash, false otherwise
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
