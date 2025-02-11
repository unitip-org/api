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
    get: {
      tags: ["Chats"],
      summary: "Get chat room by members",
      description: "Find a chat room based on provided member IDs",
      security: swaggerSecurity,
      parameters: [
        {
          name: "members",
          in: "query",
          description: "Comma-separated list of member IDs",
          required: true,
          schema: {
            type: "string",
            example: "user_uuid_1,user_uuid_2",
          },
        },
      ],
      responses: {
        200: {
          description: "Successfully retrieved chat room",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  room_id: {
                    type: "string",
                    description: "Chat room ID if found, null if not found",
                    nullable: true,
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Bad request - Members parameter is missing",
          content: {
            "application/json": {
              schema: { $ref: swaggerComponentRefs.BadRequestError },
            },
          },
        },
        401: {
          description: "Unauthorized - Invalid or missing bearer token",
          content: {
            "application/json": {
              schema: { $ref: swaggerComponentRefs.UnauthorizedError },
            },
          },
        },
        500: {
          description: "Internal Server Error",
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
