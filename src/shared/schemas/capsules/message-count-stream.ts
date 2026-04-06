import { z } from "zod";

export const messageCountStreamResponseSchema = z.object({
  messageCount: z.number().int(),
});

export type MessageCountStreamResponse = z.infer<
  typeof messageCountStreamResponseSchema
>;
