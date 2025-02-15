import { swaggerSecurity } from "@/lib/swagger/security";

export const jobsIdPaths = {
  "/api/v1/jobs/{job_id}": {
    get: {
      deprecated: true,
      operationId: "getJob",
      tags: ["Job"],
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
                  // title: { type: "string" },
                  destination_location: { type: "string" },
                  destination_latitude: { type: "number", format: "float" },
                  destination_longitude: { type: "number", format: "float" },
                  note: { type: "string" },
                  service: { type: "string" },
                  pickup_location: { type: "string" },
                  pickup_latitude: { type: "number", format: "float" },
                  pickup_longitude: { type: "number", format: "float" },
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
