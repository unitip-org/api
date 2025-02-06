import { swaggerSecurity } from "@/lib/swagger/security";

export const editPasswordPaths = {
  "/api/v1/accounts/profile/password": {
    patch: {
      tags: ["Account"],
      security: swaggerSecurity,
      summary: "Mengubah password",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
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
                properties: {
                  success: { type: "boolean" },
                  users: {
                    type: "array",
                    items: {
                      type: "object",
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
      },
    },
  },
};
