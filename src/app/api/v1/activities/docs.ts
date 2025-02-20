import { swaggerSecurity } from "@/lib/swagger/security";

export const activitiesPaths = {
  "/api/v1/activities": {
    post: {
      operationId: "createActivity",
      tags: ["Activity"],
      security: swaggerSecurity,
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["content"],
              properties: {
                parent: { type: "string" },
                content: { type: "string" },
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
                required: ["id"],
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
