import { swaggerSecurity } from "@/lib/swagger/security";

export const jobsPaths = {
  "/api/v1/jobs": {
    get: {
      tags: ["Jobs"],
      summary: "mendapatkan daftar jobs",
      description:
        "endpoint ini digunakan untuk mendapatkan semua daftar jobs baik single maupun multi",
      security: swaggerSecurity,
      parameters: [
        {
          in: "query",
          name: "limit",
          schema: {
            type: "number",
          },
          required: false,
          default: 10,
        },
        {
          in: "query",
          name: "page",
          schema: {
            type: "number",
          },
          required: false,
          default: 1,
        },
      ],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  jobs: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        type: { type: "string" },
                        title: { type: "string" },
                        destination: { type: "string" },
                        note: { type: "string" },
                        service: { type: "string" },
                        pickup_location: { type: "string" },
                        total_applications: { type: "number" },
                        created_at: { type: "string" },
                        updated_at: { type: "string" },
                        customer: {
                          type: "object",
                          properties: {
                            name: { type: "string" },
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
    },
  },
};
