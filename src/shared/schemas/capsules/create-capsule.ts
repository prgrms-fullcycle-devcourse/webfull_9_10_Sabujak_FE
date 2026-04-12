import { z } from "zod";
import {
  capsuleBaseResponseSchema,
  isoDateTimeStringSchema,
  passwordSchema,
  slugSchema,
  titleSchema,
} from "./shared";

export const createCapsuleBodySchema = z.object({
  slug: slugSchema,
  title: titleSchema,
  password: passwordSchema,
  openAt: isoDateTimeStringSchema,
  reservationToken: z.string(),
  reservationSessionToken: z.string().optional(),
});

export const createCapsuleResponseSchema = capsuleBaseResponseSchema;

export type CreateCapsuleBody = z.infer<typeof createCapsuleBodySchema>;
export type CreateCapsuleResponse = z.infer<typeof createCapsuleResponseSchema>;
