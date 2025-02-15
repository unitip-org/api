import { swaggerSecurity } from "@/lib/swagger/security";

export const accountsCustomerDashboardPaths = {
  "/api/v1/accounts/customer/dashboard": {
    get: {
      operationId: "getDashboardCustomer",
      tags: ["Account"],
      summary: "mendapatkan job yang sedang berlangsung dan perlu tindakan",
      security: swaggerSecurity,
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  need_action: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        note: { type: "string" },
                        type: { type: "string" },
                        status: { type: "string" },
                      },
                    },
                  },
                  ongoing: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        note: { type: "string" },
                        type: { type: "string" },
                        status: { type: "string" },
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