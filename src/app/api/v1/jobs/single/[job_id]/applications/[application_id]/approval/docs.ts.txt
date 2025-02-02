import { swaggerSecurity } from "@/lib/swagger/security";

export const approvalSingleJobApplicationByIdPaths = {
  "/api/v1/jobs/single/{job_id}/applications/{application_id}/approval": {
    patch: {
      tags: ["Single Jobs"],
      security: swaggerSecurity,
      summary: "menyetujui lamaran single job",
      description: "endpoint ini digunakan untuk menyetujui lamaran single job",
      parameters: [
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
