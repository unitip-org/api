import { swaggerSecurity } from "@/lib/swagger/security";

export const editPasswordPaths = {
  "/api/v1/accounts/profile/password": {
    patch: {
      operationId: "updatePassword",
      tags: ["Account"],
      security: swaggerSecurity,
      summary: "Mengubah password",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["password"],
              properties: {
                password: { type: "string" },
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
                required: ["id"],
                properties: {
                  id: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
};
