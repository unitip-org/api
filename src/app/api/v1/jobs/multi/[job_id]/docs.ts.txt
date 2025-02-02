import { swaggerSecurity } from "@/lib/swagger/security";

export const multiJobByIdPaths = {
  "/api/v1/jobs/multi/{job_id}": {
    get: {
      tags: ["Multi Jobs"],
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
                  service: { type: "string" },
                  pickup_location: { type: "string" },
                  created_at: { type: "string" },
                  updated_at: { type: "string" },
                  customer_id: { type: "string" },
                  applications: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        freelancer_name: { type: "string" },
                        price: { type: "number" },
                      },
                    },
                  },
                  followers: { type: "array" },
                },
              },
            },
          },
        },
      },
    },
    patch: {
      tags: ["Multi Jobs"],
    },
    delete: {
      tags: ["Multi Jobs"],
    },
  },
};
