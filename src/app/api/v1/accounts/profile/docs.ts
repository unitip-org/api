import { swaggerSecurity } from "@/lib/swagger/security";

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
      operationId: "updateProfile",
      tags: ["Account"],
      security: swaggerSecurity,
      summary: "Mengedit informasi akun",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "gender"],
              properties: {
                name: { type: "string" },
                gender: {
                  type: "string",
                  enum: ["male", "female", ""],
                  "x-enum-varnames": ["Male", "Female", "NotSpecified"],
                },
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
                required: ["id", "name", "gender"],
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  gender: {
                    type: "string",
                    enum: ["male", "female", ""],
                    "x-enum-varnames": ["Male", "Female", "NotSpecified"],
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
