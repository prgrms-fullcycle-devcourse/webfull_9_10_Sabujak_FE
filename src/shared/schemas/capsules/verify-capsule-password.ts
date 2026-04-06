import { z } from "zod";
import { passwordSchema } from "./shared";

export const verifyPasswordBodySchema = z.object({
  password: passwordSchema,
});

export const verifyPasswordResponseSchema = z.object({
  verified: z.boolean(),
});

export type VerifyPasswordBody = z.infer<typeof verifyPasswordBodySchema>;
export type VerifyPasswordResponse = z.infer<
  typeof verifyPasswordResponseSchema
>;
