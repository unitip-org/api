import { swaggerSecurity } from "@/lib/swagger/security";

const parameters = [
  {
    in: "path",
    name: "job_id",
    required: true,
    schema: { type: "string" },
  },
];

export const jobsIdApplicationsIdPaths = {
  "/api/v1/jobs/{job_id}/applications/{application_id}": {
    delete: {
      tags: ["Jobs"],
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
                },
              },
            },
          },
        },
      },
    },
  },
};
