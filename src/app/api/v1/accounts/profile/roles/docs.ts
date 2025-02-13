import { swaggerSecurity } from "@/lib/swagger/security";
import { Item } from "@radix-ui/react-accordion";

export const changeRolePaths = {
  "/api/v1/accounts/profile/role": {
    get: {
      tags: ["Accounts"],
      security: swaggerSecurity,
      summary: "Mendapatkan semua peran akun terkait",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
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
      tags: ["Accounts"],
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
