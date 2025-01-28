import { swaggerSecurity } from "@/lib/swagger/security";

export const account = {
  "api/v1/account": {
    patch: {
      tags: ["Account"],
      security: swaggerSecurity,
      summary: "Mengedit informasi akun",
      parameters: [
        {
          in: "path",
          name: "name",
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
                  success: { type: "boolean" },
                  users: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        age: { type: "number" },
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
