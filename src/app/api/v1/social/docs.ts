import { swaggerSecurity } from "@/lib/swagger/security";
import { he } from "date-fns/locale";

export const socialPaths = {
  "/api/v1/social": {
    get: {
      operationId: "getSocial",
      tags: ["Social"],
      summary: "mendapatkan data sosial",
      security: swaggerSecurity,
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  activities: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        censored_name: {
                          type: "string",
                        },
                        activity_type: {
                          type: "string",
                          enum: ["job", "offer"],
                        },
                        time_ago: {
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
      },
    },
  },
};
