import { swaggerSecurity } from "@/lib/swagger/security";

const parameters = [
  {
    in: "path",
    name: "job_id",
    required: true,
    schema: { type: "string" },
  },
  {
    in: "path",
    name: "application_id",
    required: true,
    schema: { type: "string" },
  },
];

export const jobsIdApplicationsIdApprovalPaths = {
  "/api/v1/jobs/{job_id}/applications/{application_id}/approval": {
    patch: {
      tags: ["Jobs"],
      summary: "menerima salah satu lamaran pekerjaan dari driver",
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
