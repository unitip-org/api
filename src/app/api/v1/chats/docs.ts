import { swaggerComponentRefs } from "@/lib/swagger/component";
import { swaggerSecurity } from "@/lib/swagger/security";

export const chatsPaths = {
  "/api/v1/chats": {
    post: {
      tags: ["Chats"],
      security: swaggerSecurity,
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                to_user_id: { type: "string" },
                message: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "string" },
                },
              },
            },
          },
        },
        400: {
          content: {
            "application/json": {
              schema: { $ref: swaggerComponentRefs.BadRequestError },
            },
          },
        },
        401: {
          content: {
            "application/json": {
              schema: { $ref: swaggerComponentRefs.UnauthorizedError },
            },
          },
        },
        500: {
          content: {
            "application/json": {
              schema: { $ref: swaggerComponentRefs.InternalServerError },
            },
          },
        },
      },
    },
  },
};
