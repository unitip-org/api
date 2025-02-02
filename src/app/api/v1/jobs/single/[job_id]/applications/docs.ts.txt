import { swaggerSecurity } from "@/lib/swagger/security";

export const applicationBySingleJobIdPaths = {
  "/api/v1/jobs/single/{job_id}/applications": {
    post: {
      tags: ["Single Jobs"],
      summary: "lamar sebuah single job",
      description: "endpoint ini digunakan untuk melamar sebuah single job",
      security: swaggerSecurity,
      parameters: [
        {
          in: "path",
          name: "job_id",
          required: true,
          schema: { type: "string" },
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                price: {
                  type: "number",
                },
              },
            },
          },
        },
      },
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
    delete: {
      tags: ["Single Jobs"],
      summary: "hapus lamaran single job",
      description: "endpoint ini digunakan untuk menghapus lamaran single job",
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
