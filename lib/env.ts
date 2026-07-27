import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, { message: "DATABASE_URL environment variable is required." }),
  AUTH_SECRET: z
    .string()
    .min(1, { message: "AUTH_SECRET environment variable is required." }),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error(
      "❌ Invalid environment configuration:",
      result.error.flatten().fieldErrors
    );
    throw new Error(
      "Invalid environment variables. Please check your environment configuration."
    );
  }

  return result.data;
};

export const env = parseEnv();
