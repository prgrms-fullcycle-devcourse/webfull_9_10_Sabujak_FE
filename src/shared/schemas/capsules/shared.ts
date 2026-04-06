import { z } from "zod";

export const isoDateTimeStringSchema = z.string().datetime();

export const slugSchema = z
  .string()
  .trim()
  .min(1, "1자 이상 입력해주세요.")
  .max(50, "최대 50자까지 입력 가능합니다.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "소문자와 숫자,하이픈(-)만 사용 가능합니다."
  );

export const titleSchema = z
  .string()
  .trim()
  .min(1, "1자 이상 입력해주세요")
  .max(100, "최대 100자까지 입력 가능합니다.");

export const passwordSchema = z
  .string()
  .regex(/^\d+$/, "숫자만 입력해주세요.")
  .length(4, "비밀번호 4자리를 입력해주세요.");

export const nicknameSchema = z
  .string()
  .trim()
  .min(1, "1자 이상 입력해주세요.")
  .max(20, "최대 20자까지 입력 가능합니다.");

export const messageContentSchema = z
  .string()
  .trim()
  .min(1, "메시지는 1자 이상 입력해야 합니다.")
  .max(1000, "메시지는 최대 1000자까지 입력 가능합니다.");

export const capsuleBaseResponseShape = {
  id: z.string(),
  slug: slugSchema,
  title: titleSchema,
  openAt: isoDateTimeStringSchema,
  expiresAt: isoDateTimeStringSchema,
  createdAt: isoDateTimeStringSchema,
  updatedAt: isoDateTimeStringSchema,
};

export const capsuleBaseResponseSchema = z.object(capsuleBaseResponseShape);

export const capsuleSlugParamsSchema = z.object({
  slug: slugSchema,
});

export type CapsuleBaseResponse = z.infer<typeof capsuleBaseResponseSchema>;
export type CapsuleSlugParams = z.infer<typeof capsuleSlugParamsSchema>;
