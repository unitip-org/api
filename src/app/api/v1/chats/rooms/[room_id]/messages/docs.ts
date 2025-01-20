import { swaggerComponentRefs } from "@/lib/swagger/component";
import { swaggerSecurity } from "@/lib/swagger/security";

export const chatMessagesByRoomIdPaths = {
  "/api/v1/chats/rooms/{room_id}/messages": {
    post: {
      tags: ["Chats"],
      summary: "mengirim pesan chat baru",
      description:
        "endpoint untuk mengirimkan pesan chat baru berdasarkan id room chat",
      security: swaggerSecurity,
      parameters: [
        {
          in: "path",
          name: "room_id",
          required: true,
          schema: { type: "string" },
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                id: { type: "string" },
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
                  message: { type: "string" },
                  created_at: { type: "string" },
                  updated_at: { type: "string" },
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

    get: {
      tags: ["Chats"],
      summary: "mendapatkan riwayat chat",
      description:
        "endpoint untuk mendapatkan riwayat chat untuk user yang terautentikasi berdasarkan room chat id",
      security: swaggerSecurity,
      parameters: [
        {
          in: "path",
          name: "room_id",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  other_user: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      last_read_message: { type: "string" },
                    },
                  },
                  messages: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        message: { type: "string" },
                        is_deleted: { type: "boolean" },
                        room_id: { type: "string" },
                        user_id: { type: "string" },
                        created_at: { type: "string" },
                        updated_at: { type: "string" },
                      },
                    },
                  },
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
