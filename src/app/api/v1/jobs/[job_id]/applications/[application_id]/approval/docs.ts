import { swaggerSecurity } from "@/lib/swagger/security";

export const jobApplicationApprovalByIdPaths = {
  "/api/v1/jobs/{job_id}/applications/{application_id}/approval": {
    patch: {
      tags: ["Jobs"],
      security: swaggerSecurity,
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {},
            },
          },
        },
      },
    },
  },
};
