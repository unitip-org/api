import { swaggerComponentRefs } from "@/lib/swagger/component";
import { swaggerSecurity } from "@/lib/swagger/security";

export const chatsPaths = {
  "/api/v1/chats": {
    post: {
      tags: ["Chats"],
      summary: "membuat chat baru (untuk test)",
      description:
        "endpoint ini digunakan untuk membuat room baru, serta menambahkan beberapa member ke dalam room tersebut berdasarkan id user",
      security: swaggerSecurity,
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                members: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  example: ["user_uuid_1", "user_uuid_2"],
                },
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
        404: {
          content: {
            "application/json": {
              schema: { $ref: swaggerComponentRefs.NotFoundError },
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
