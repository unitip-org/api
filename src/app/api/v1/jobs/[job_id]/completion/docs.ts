import { swaggerSecurity } from "@/lib/swagger/security";

export const jobsIdCompletionPaths = {
  "/api/v1/jobs/{job_id}/completion": {
    patch: {
      tags: ["Jobs"],
      security: swaggerSecurity,
      parameters: [
        {
          in: "path",
          name: "job_id",
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
