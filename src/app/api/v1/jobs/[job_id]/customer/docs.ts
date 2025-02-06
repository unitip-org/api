import { swaggerSecurity } from "@/lib/swagger/security";

export const jobsIdCustomerPaths = {
  "/api/v1/jobs/{job_id}/customer": {
    get: {
      operationId: "getJobForCustomer",
      tags: ["Job"],
      security: swaggerSecurity,
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  title: { type: "string" },
                  note: { type: "string" },
                  applications: {
                    type: "array",
                    items: {
                      type: "object",
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
