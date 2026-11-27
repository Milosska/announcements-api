import { z } from "./config.ts";

export const registerSchema = z.object({
  username: z.string().min(3).max(30).openapi({
    example: "Johny_Not_Depp",
  }),
  email: z.email().openapi({
    example: "john@example.com",
  }),
  password: z.string().min(6).openapi({
    example: "myPassword_12345",
  }),
  name: z.string().min(2).max(50).openapi({
    example: "John Doe",
  }),
});

export const loginSchema = registerSchema.pick({
  username: true,
  password: true,
});

export const refreshSchema = z.object({
  refreshToken: z.string().optional(),
});

export const userSchema = z.object({
  id: z.number().positive(),
  ...registerSchema.omit({ password: true }).shape,
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const tokensSchema = userSchema.pick({
  accessToken: true,
  refreshToken: true,
});

export type userResponse = z.infer<typeof userSchema>;
