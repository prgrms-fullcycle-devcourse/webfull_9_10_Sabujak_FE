import { z } from "zod";

export const errorCodes = [
  "INVALID_INPUT",
  "FORBIDDEN_PASSWORD",
  "CAPSULE_NOT_FOUND",
  "SLUG_ALREADY_IN_USE",
  "SLUG_RESERVATION_MISMATCH",
  "DUPLICATE_NICKNAME",
  "MESSAGE_LIMIT_EXCEEDED",
  "CAPSULE_EXPIRED",
  "CAPSULE_ALREADY_OPENED",
  "TOO_MANY_REQUESTS",
  "INTERNAL_SERVER_ERROR",
] as const;

export const errorCodeSchema = z.enum(errorCodes);

export const errorDetailSchema = z.object({
  field: z.string(),
  message: z.string(),
});

export const errorResponseSchema = z.object({
  error: z.object({
    code: errorCodeSchema,
    message: z.string(),
    details: z.array(errorDetailSchema).optional(),
  }),
});

export type ErrorCode = (typeof errorCodes)[number];
export type ErrorDetail = z.infer<typeof errorDetailSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
