import { swaggerSecurity } from "@/lib/swagger/security";
import { title } from "process";

export const multiJobPaths = {
  "/api/v1/jobs/multi": {
    post: {
      tags: ["Multi Jobs"],
      summary: "membuat multi job",
      security: swaggerSecurity,
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                },
                note: {
                  type: "string",
                },
                service: {
                  type: "string",
                },
                pickup_location: {
                  type: "string",
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
                  success: {
                    type: "boolean",
                  },
                  id: {
                    type: "string",
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
