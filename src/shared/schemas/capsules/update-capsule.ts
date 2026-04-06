import { z } from "zod";
import {
  capsuleBaseResponseSchema,
  isoDateTimeStringSchema,
  passwordSchema,
  titleSchema,
} from "./shared";

export const updateCapsuleBodySchema = z.object({
  password: passwordSchema,
  title: titleSchema,
  openAt: isoDateTimeStringSchema,
});

export const updateCapsuleResponseSchema = capsuleBaseResponseSchema;

export type UpdateCapsuleBody = z.infer<typeof updateCapsuleBodySchema>;
export type UpdateCapsuleResponse = z.infer<typeof updateCapsuleResponseSchema>;
