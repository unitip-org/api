import { swaggerSecurity } from "@/lib/swagger/security";

export const changeRolePaths = {
  "/api/v1/accounts/profile/roles": {
    get: {
      operationId: "getAllRoles",
      tags: ["Account"],
      security: swaggerSecurity,
      summary: "Mendapatkan semua peran akun terkait",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["roles"],
                properties: {
                  roles: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    patch: {
      tags: ["Account"],
      security: swaggerSecurity,
      summary: "Mengubah peran",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                role: { type: "string" },
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
