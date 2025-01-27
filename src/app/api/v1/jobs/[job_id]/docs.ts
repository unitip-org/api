import { swaggerSecurity } from "@/lib/swagger/security";

export const jobByIdPaths = {
  "/api/v1/jobs/{job_id}": {
    get: {
      tags: ["Jobs"],
      security: swaggerSecurity,
      summary: "mendapatkan detail job berdasarkan id",
      description:
        "endpoint ini digunakan untuk mendapatkan detail job berdasarkan id",
      parameters: [
        {
          in: "path",
          name: "job_id",
          schema: {
            type: "string",
          },
          required: true,
        },
      ],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  title: { type: "string" },
                  destination: { type: "string" },
                  note: { type: "string" },
                  service: { type: "string" },
                  pickup_location: { type: "string" },
                  created_at: { type: "string" },
                  updated_at: { type: "string" },
                  customer: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
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
};
