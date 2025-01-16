import { swaggerComponentRefs } from "@/lib/swagger/component";
import { swaggerSecurity } from "@/lib/swagger/security";

export const chatRoomByUserIdPaths = {
  "/api/v1/chats/rooms/users": {
    get: {
      tags: ["Chats"],
      security: swaggerSecurity,
      // parameters: [
      //   {
      //     name: "user_id",
      //     in: "path",
      //     required: true,
      //     schema: { type: "string" },
      //   },
      // ],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  rooms: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        from_user_id: { type: "string" },
                        from_user_name: { type: "string" },
                        to_user_id: { type: "string" },
                        last_message: { type: "string" },
                        last_sent_user_id: { type: "string" },
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
