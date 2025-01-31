import { swaggerSecurity } from "@/lib/swagger/security";
import { title } from "process";

export const accountPaths = {
  "/api/v1/account": {
    patch: {
      tags: ["Accounts"],
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
