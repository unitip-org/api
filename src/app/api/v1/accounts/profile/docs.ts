import { swaggerSecurity } from "@/lib/swagger/security";
import { title } from "process";

export const accountsProfilePaths = {
  "/api/v1/accounts/profile": {
    get: {
      operationId: "refreshProfile",
      tags: ["Account"],
      security: swaggerSecurity,
      summary: "Mengambil data user terbaru",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id", "name", "email", "token", "role", "gender"],
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  email: { type: "string" },
                  token: { type: "string" },
                  role: { type: "string" },
                  gender: { type: "string" },
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
      summary: "Mengedit informasi akun",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string" },
                gender: { type: "string" },
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
                        name: { type: "string" },
                        gender: { type: "string" },
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
