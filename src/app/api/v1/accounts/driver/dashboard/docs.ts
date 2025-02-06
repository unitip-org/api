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
              schema: {
                type: "object",
                required: ["applications", "jobs", "offers"],
                properties: {
                  applications: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["id", "bid_price", "bid_note", "job"],
                      properties: {
                        id: { type: "string" },
                        bid_price: { type: "number" },
                        bid_note: { type: "string" },
                        job: {
                          type: "object",
                          required: ["id", "title", "customer"],
                          properties: {
                            id: { type: "string" },
                            title: { type: "string" },
                            customer: {
                              type: "object",
                              required: ["name"],
                              properties: {
                                name: { type: "string" },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  jobs: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["id", "title", "customer"],
                      properties: {
                        id: { type: "string" },
                        title: { type: "string" },
                        customer: {
                          type: "object",
                          required: ["name"],
                          properties: {
                            name: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                  offers: {
                    type: "array",
                    items: {
                      type: "object",
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
