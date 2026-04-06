import { z } from "zod";
import { passwordSchema } from "./shared";

export const deleteCapsuleBodySchema = z.object({
  password: passwordSchema,
});

export type DeleteCapsuleBody = z.infer<typeof deleteCapsuleBodySchema>;
