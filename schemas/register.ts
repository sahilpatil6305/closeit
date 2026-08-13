import { z } from "zod";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: "Name must be at least 2 characters long" })
      .max(50, { message: "Name must not exceed 50 characters" }),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email({ message: "Please enter a valid email address" }),
    password: z.string().min(PASSWORD_MIN_LENGTH, {
      message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`,
    }),
    confirmPassword: z.string({
      message: "Please confirm your password",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
