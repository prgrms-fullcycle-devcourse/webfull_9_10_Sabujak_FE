import { z } from "zod";
import { isoDateTimeStringSchema, slugSchema } from "./shared";

export const createSlugReservationBodySchema = z.object({
  slug: slugSchema,
});

export const slugReservationResponseSchema = z.object({
  slug: slugSchema,
  reservationToken: z.string(),
  reservedUntil: isoDateTimeStringSchema,
});

export type CreateSlugReservationBody = z.infer<
  typeof createSlugReservationBodySchema
>;
export type SlugReservationResponse = z.infer<
  typeof slugReservationResponseSchema
>;
