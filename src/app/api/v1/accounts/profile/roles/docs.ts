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
      operationId: "changeRole",
      tags: ["Account"],
      security: swaggerSecurity,
      summary: "Mengubah peran",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["role"],
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
                required: ["id", "token", "role"],
                properties: {
                  id: { type: "string" },
                  token: { type: "string" },
                  role: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
};
