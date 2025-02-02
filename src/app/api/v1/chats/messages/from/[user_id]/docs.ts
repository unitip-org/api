import { swaggerComponentRefs } from "@/lib/swagger/component";
import { swaggerSecurity } from "@/lib/swagger/security";

/**
 * @deprecated
 */
export const chatMessagesFromUserIdPaths = {
  "/api/v1/chats/messages/from/{user_id}": {
    get: {
      tags: ["Chats"],
      deprecated: true,
      security: swaggerSecurity,
      parameters: [
        {
          in: "path",
          name: "user_id",
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
                  messages: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        from_user_id: { type: "string" },
                        to_user_id: { type: "string" },
                        message: { type: "string" },
                        is_deleted: { type: "boolean" },
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
