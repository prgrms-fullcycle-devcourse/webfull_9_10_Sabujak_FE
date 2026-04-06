import { z } from "zod";
import {
  capsuleBaseResponseSchema,
  capsuleBaseResponseShape,
  isoDateTimeStringSchema,
} from "./shared";

export const closedCapsuleResponseSchema = capsuleBaseResponseSchema.extend({
  isOpen: z.literal(false),
  messageCount: z.number().int(),
});

export const messageSchema = z.object({
  id: z.number().int(),
  nickname: z.string(),
  content: z.string(),
  createdAt: isoDateTimeStringSchema,
});

export const openedCapsuleResponseSchema = z.object({
  ...capsuleBaseResponseShape,
  updatedAt: isoDateTimeStringSchema,
  isOpen: z.literal(true),
  messageCount: z.number().int(),
  messages: z.array(messageSchema),
});

export const closedCapsuleResponseForUnionSchema = z.object({
  ...capsuleBaseResponseShape,
  isOpen: z.literal(false),
  messageCount: z.number().int(),
});

export const openedCapsuleResponseForUnionSchema = z.object({
  ...capsuleBaseResponseShape,
  updatedAt: isoDateTimeStringSchema,
  isOpen: z.literal(true),
  messageCount: z.number().int(),
  messages: z.array(messageSchema),
});

export const capsuleDetailResponseSchema = z.discriminatedUnion("isOpen", [
  closedCapsuleResponseForUnionSchema,
  openedCapsuleResponseForUnionSchema,
]);

export type CapsuleMessage = z.infer<typeof messageSchema>;
export type ClosedCapsuleResponse = z.infer<typeof closedCapsuleResponseSchema>;
export type OpenedCapsuleResponse = z.infer<typeof openedCapsuleResponseSchema>;
export type CapsuleDetailResponse = z.infer<typeof capsuleDetailResponseSchema>;
