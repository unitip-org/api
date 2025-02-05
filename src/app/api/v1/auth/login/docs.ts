import { swaggerComponentRefs } from "@/lib/swagger/component";

export const authLoginPaths = {
  "/api/v1/auth/login": {
    post: {
      operationId: "login",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: {
                  type: "string",
                },
                password: {
                  type: "string",
                },
                role: {
                  type: "string",
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "need_role",
                  "roles",
                  "id",
                  "name",
                  "email",
                  "token",
                  "role",
                ],
                properties: {
                  need_role: {
                    type: "boolean",
                  },
                  roles: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  id: {
                    type: "string",
                  },
                  name: {
                    type: "string",
                  },
                  email: {
                    type: "string",
                  },
                  token: {
                    type: "string",
                  },
                  role: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        "400": {
          content: {
            "application/json": {
              schema: {
                $ref: swaggerComponentRefs.BadRequestError,
              },
            },
          },
        },
        "404": {
          content: {
            "application/json": {
              schema: {
                $ref: swaggerComponentRefs.NotFoundError,
              },
            },
          },
        },
        "500": {
          content: {
            "application/json": {
              schema: {
                $ref: swaggerComponentRefs.InternalServerError,
              },
            },
          },
        },
      },
    },
  },
};
