import { z } from "zod";
import {
  isoDateTimeStringSchema,
  messageContentSchema,
  nicknameSchema,
} from "./shared";

export const createMessageBodySchema = z.object({
  nickname: nicknameSchema,
  content: messageContentSchema,
});

export const createMessageResponseSchema = z.object({
  id: z.number().int(),
  nickname: nicknameSchema,
  content: messageContentSchema,
  createdAt: isoDateTimeStringSchema,
});

export type CreateMessageBody = z.infer<typeof createMessageBodySchema>;
export type CreateMessageResponse = z.infer<typeof createMessageResponseSchema>;
