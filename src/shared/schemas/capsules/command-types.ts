import { z } from "zod";
import { createCapsuleBodySchema } from "./create-capsule";
import { createMessageBodySchema } from "./create-message";
import { deleteCapsuleBodySchema } from "./delete-capsule";
import { createSlugReservationBodySchema } from "./slug-reservation";
import { capsuleSlugParamsSchema } from "./shared";
import { updateCapsuleBodySchema } from "./update-capsule";
import { verifyPasswordBodySchema } from "./verify-capsule-password";

type CapsuleSlugParams = z.infer<typeof capsuleSlugParamsSchema>;

export type CreateSlugReservationInput = z.infer<
  typeof createSlugReservationBodySchema
>;

export type CreateCapsuleInput = z.infer<typeof createCapsuleBodySchema>;

export type GetCapsuleInput = CapsuleSlugParams;

export type VerifyCapsulePasswordInput = CapsuleSlugParams &
  z.infer<typeof verifyPasswordBodySchema>;

export type UpdateCapsuleInput = CapsuleSlugParams &
  z.infer<typeof updateCapsuleBodySchema>;

export type DeleteCapsuleInput = CapsuleSlugParams &
  z.infer<typeof deleteCapsuleBodySchema>;

export type CreateMessageInput = CapsuleSlugParams &
  z.infer<typeof createMessageBodySchema>;
