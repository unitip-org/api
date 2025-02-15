import { swaggerSecurity } from "@/lib/swagger/security";

const parameters = [
  {
    in: "path",
    name: "job_id",
    required: true,
    schema: { type: "string" },
  },
];

export const jobsIdDriverPaths = {
  "/api/v1/jobs/{job_id}/driver": {
    get: {
      operationId: "getJobForDriver",
      tags: ["Job"],
      security: swaggerSecurity,
      parameters,
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  // title: { type: "string" },
                  note: { type: "string" },
                  applications: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        price: { type: "integer" },
                        bid_note: { type: "string" },
                        driver: {
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
