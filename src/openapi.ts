import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";

import {
  registerSchema,
  loginSchema,
  refreshSchema,
  userSchema,
  tokensSchema,
  meSchema,
} from "./validators/authValidator.ts";
import {
  getAnnouncementsQuerySchema,
  getAnnouncementParamSchema,
  createAnnouncementSchema,
  updateAnnouncementSchema,
  announcementSchema,
  paginatedAnnouncementsSchema,
} from "./validators/announcementsValidator.ts";

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
const LoginSchema = registry.register("Login", loginSchema);
const RefreshSchema = registry.register("Refresh", refreshSchema);
const UserSchema = registry.register("User", userSchema);
const TokensSchema = registry.register("Tokens", tokensSchema);
const MeSchema = registry.register("Me", meSchema);

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
    500: { description: "Internal Server Error" },
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Auth"],
  summary: "Login registered user",
  request: {
    body: {
      content: {
        "application/json": { schema: LoginSchema },
      },
    },
  },
  responses: {
    200: {
      description: "User logged in successfully",
      content: {
        "application/json": {
          schema: UserSchema,
        },
      },
    },
    401: { description: "Incorrect username or password" },
    422: { description: "Validation error" },
    500: { description: "Internal Server Error" },
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/refresh",
  tags: ["Auth"],
  summary: "Refresh tokens for user",
  request: {
    body: {
      content: {
        "application/json": { schema: RefreshSchema },
      },
    },
  },
  responses: {
    200: {
      description: "Tokens refreshed successfully",
      content: {
        "application/json": {
          schema: TokensSchema,
        },
      },
    },
    401: { description: "Refresh token is not provided, invalid or expired" },
    422: { description: "Validation error" },
    500: { description: "Internal Server Error" },
  },
});

registry.registerPath({
  method: "get",
  path: "/auth/me",
  tags: ["Auth"],
  security: [{ bearerAuth: [] }],
  summary: "Get user info",
  request: {},
  responses: {
    200: {
      description: "User data returned",
      content: {
        "application/json": {
          schema: MeSchema,
        },
      },
    },
    401: {
      description:
        "Access token is not provided, invalid or expired; User not found",
    },
    500: { description: "Internal Server Error" },
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/logout",
  tags: ["Auth"],
  security: [{ bearerAuth: [] }],
  summary: "Logout registered user",
  request: {},
  responses: {
    204: {
      description: "User logged out successfully",
    },
    401: {
      description:
        "Access token is not provided, invalid or expired; User not found",
    },
    500: { description: "Internal Server Error" },
  },
});

// Announcements path group
const GetAnnouncementsQuerySchema = registry.register(
  "Get Announcements Query",
  getAnnouncementsQuerySchema,
);
const GetAnnouncementParamSchema = registry.register(
  "Get Announcement Params",
  getAnnouncementParamSchema,
);
const CreateAnnouncementSchema = registry.register(
  "Create Announcement",
  createAnnouncementSchema,
);
const UpdateAnnouncementSchema = registry.register(
  "Update Announcement",
  updateAnnouncementSchema,
);
const AnnouncementSchema = registry.register(
  "Announcement",
  announcementSchema,
);
const PaginatedAnnouncementsSchema = registry.register(
  "Announcements",
  paginatedAnnouncementsSchema,
);

registry.registerPath({
  method: "get",
  path: "/announcements",
  tags: ["Announcements"],
  summary: "Get announcements",
  request: {
    query: GetAnnouncementsQuerySchema,
  },
  responses: {
    200: {
      description: "Announcements returned successfully",
      content: {
        "application/json": {
          schema: PaginatedAnnouncementsSchema,
        },
      },
    },
    422: { description: "Validation error" },
    500: { description: "Internal Server Error" },
  },
});

registry.registerPath({
  method: "get",
  path: "/announcements/{id}",
  tags: ["Announcements"],
  summary: "Get announcement by ID",
  request: {
    params: GetAnnouncementParamSchema,
  },
  responses: {
    200: {
      description: "Announcement returned successfully",
      content: {
        "application/json": {
          schema: AnnouncementSchema,
        },
      },
    },
    404: { description: "Announsment with provided id is not found" },
    422: { description: "Incorrect params format" },
    500: { description: "Internal Server Error" },
  },
});

registry.registerPath({
  method: "post",
  path: "/announcements",
  tags: ["Announcements"],
  security: [{ bearerAuth: [] }],
  summary: "Create new announcement",
  request: {
    body: {
      content: {
        "application/json": { schema: CreateAnnouncementSchema },
      },
    },
  },
  responses: {
    201: {
      description: "Announcement created successfully",
      content: {
        "application/json": {
          schema: AnnouncementSchema,
        },
      },
    },
    401: {
      description:
        "Access token is not provided, invalid or expired; User not found",
    },
    422: { description: "Validation error" },
    500: { description: "Internal Server Error" },
  },
});

registry.registerPath({
  method: "patch",
  path: "/announcements/{id}",
  tags: ["Announcements"],
  security: [{ bearerAuth: [] }],
  summary: "Update existing announcement",
  request: {
    params: GetAnnouncementParamSchema,
    body: {
      content: {
        "application/json": { schema: UpdateAnnouncementSchema },
      },
    },
  },
  responses: {
    200: {
      description: "Announcement updated successfully",
      content: {
        "application/json": {
          schema: AnnouncementSchema,
        },
      },
    },
    401: {
      description:
        "Access token is not provided, invalid or expired; User not found",
    },
    403: { description: "Access denied" },
    404: { description: "Announsment with provided id is not found" },
    422: { description: "Validation error" },
    500: { description: "Internal Server Error" },
  },
});

registry.registerPath({
  method: "delete",
  path: "/announcements/{id}",
  tags: ["Announcements"],
  security: [{ bearerAuth: [] }],
  summary: "Delete existing announcement",
  request: {
    params: GetAnnouncementParamSchema,
  },
  responses: {
    204: {
      description: "Announcement deleted successfully",
    },
    401: {
      description:
        "Access token is not provided, invalid or expired; User not found",
    },
    403: { description: "Access denied" },
    404: { description: "Announsment with provided id is not found" },
    422: { description: "Validation error" },
    500: { description: "Internal Server Error" },
  },
});
