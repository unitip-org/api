import { swaggerComponentRefs } from "@/lib/swagger/component";
import { swaggerSecurity } from "@/lib/swagger/security";

export const readChatByRoomIdPaths = {
  "/api/v1/chats/rooms/{room_id}/read": {
    patch: {
      tags: ["Chats"],
      summary: "baca chat berdasarkan room id",
      description:
        "endpoint ini digunakan untuk membaca chat berdasarkan room id dengan cara mengirimkan checkpoint chat terakhir (message id) yang dibaca oleh user yang sedang login",
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
                last_read_message_id: { type: "string" },
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
                  room_id: { type: "string" },
                  user_id: { type: "string" },
                  last_read_message_id: { type: "string" },
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
