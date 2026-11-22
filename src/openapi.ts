import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";

import { registerSchema, userSchema } from "./validators/authValidator.ts";

export const registry = new OpenAPIRegistry();

registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Your API",
      version: "1.0.0",
      description: "REST API for your project",
    },
    servers: [{ url: "http://localhost:3000" }],
  });
}

// Auth path group
const RegisterSchema = registry.register("Register", registerSchema);
const UserSchema = registry.register("User", userSchema);

registry.registerPath({
  method: "post",
  path: "/auth/register",
  tags: ["Auth"],
  summary: "Register a new user",
  request: {
    body: {
      content: {
        "application/json": { schema: RegisterSchema },
      },
    },
  },
  responses: {
    201: {
      description: "User registered successfully",
      content: {
        "application/json": {
          schema: UserSchema,
        },
      },
    },
    409: { description: "Username or email already taken" },
    422: { description: "Validation error" },
  },
});
