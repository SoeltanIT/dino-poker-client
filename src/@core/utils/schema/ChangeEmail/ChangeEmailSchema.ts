import { z } from "zod";

export const ChangeEmailSchema = z
  .object({
    currentEmail:z
      .string()
      .min(5, "Email must be at least 5 characters")
      .regex(/^[a-zA-Z0-9._-가-힣\u00C0-\u1FFF\u2C00-\uD7FF]+@[a-zA-Z0-9.-가-힣\u00C0-\u1FFF\u2C00-\uD7FF]+\.[a-zA-Z]{2,6}$/, "email must be a valid email address")
      .max(100, "Email must not exceed 100 characters"),
    newEmail: z
      .string()
      .min(5, "Email must be at least 5 characters")
      .regex(/^[a-zA-Z0-9._-가-힣\u00C0-\u1FFF\u2C00-\uD7FF]+@[a-zA-Z0-9.-가-힣\u00C0-\u1FFF\u2C00-\uD7FF]+\.[a-zA-Z]{2,6}$/, "email must be a valid email address")
      .max(100, "Email must not exceed 100 characters"),
    retypeNewEmail: z
      .string()
      .min(5, "Email must be at least 5 characters")
      .regex(/^[a-zA-Z0-9._-가-힣\u00C0-\u1FFF\u2C00-\uD7FF]+@[a-zA-Z0-9.-가-힣\u00C0-\u1FFF\u2C00-\uD7FF]+\.[a-zA-Z]{2,6}$/, "email must be a valid email address")
      .max(100, "Email must not exceed 100 characters"),
  })
  .refine((data) => data.newEmail === data.retypeNewEmail, {
    message: "New email addresses don't match.",
    path: ["retypeNewEmail"],
  })
  .refine((data) => data.currentEmail !== data.newEmail, {
    message: "New email must be different from current email.",
    path: ["newEmail"],
  });

  export type ChangeEmailType = z.infer<typeof ChangeEmailSchema>;