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
                        bid_price: { type: "integer" },
                        bid_note: { type: "string" },
                        job: {
                          type: "object",
                          required: [
                            "id",
                            "note",
                            "expected_price",
                            "customer",
                          ],
                          properties: {
                            id: { type: "string" },
                            note: { type: "string" },
                            expected_price: { type: "integer" },
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
                      required: [
                        "id",
                        "title",
                        "price",
                        "description",
                        "pickup_area",
                        "destination_area",
                        "type",
                        "available_until",
                        "max_participants",
                        "applicants",
                      ],
                      properties: {
                        id: { type: "string" },
                        title: { type: "string" },
                        price: { type: "integer" },
                        description: { type: "string" },
                        pickup_area: { type: "string" },
                        destination_area: { type: "string" },
                        type: { type: "string" },
                        available_until: { type: "string" },
                        max_participants: { type: "integer" },
                        applicants: {
                          type: "array",
                          items: {
                            type: "object",
                            required: [
                              "id",
                              "customer_name",
                              "pickup_location",
                              "destination_location",
                              "status",
                              "final_price",
                            ],
                            properties: {
                              id: { type: "string" },
                              customer_name: { type: "string" },
                              pickup_location: { type: "string" },
                              destination_location: { type: "string" },
                              status: { type: "string" },
                              final_price: { type: "integer" },
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
    },
  },
};
