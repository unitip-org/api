import { swaggerSecurity } from "@/lib/swagger/security";

export const accountsDriverDashboardPaths = {
  "/api/v1/accounts/driver/dashboard": {
    get: {
      operationId: "getDashboardDriver",
      tags: ["Account"],
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
