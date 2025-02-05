import { swaggerComponentRefs } from "@/lib/swagger/component";

export const authRegisterPaths = {
  "/api/v1/auth/register": {
    post: {
      operationId: "register",
      tags: ["Auth"],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "name", "password"],
              properties: {
                email: {
                  type: "string",
                },
                name: {
                  type: "string",
                },
                password: {
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
                required: ["id", "name", "email", "token", "role"],
                properties: {
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
        "409": {
          content: {
            "application/json": {
              schema: {
                $ref: swaggerComponentRefs.ConflictError,
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
