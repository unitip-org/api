import { swaggerSecurity } from "@/lib/swagger/security";

export const detailOfferPaths = {
  "/api/v1/offers/{offer_id}": {
    get: {
      tags: ["Offers"],
      summary: "Mendapatkan detail single offer",
      security: swaggerSecurity,
      parameters: [
        {
          name: "offer_id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
          description: "ID dari offer yang ingin dilihat detailnya",
        },
      ],
      responses: {
        200: {
          description: "Successful response",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  offer: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                      },
                      title: {
                        type: "string",
                      },
                      description: {
                        type: "string",
                      },
                      type: {
                        type: "string",
                      },
                      available_until: {
                        type: "string",
                      },
                      price: {
                        type: "number",
                      },
                      destination_area: {
                        type: "string",
                      },
                      pickup_area: {
                        type: "string",
                      },
                      offer_status: {
                        type: "string",
                      },
                      max_participants: {
                        type: "number",
                      },
                      freelancer: {
                        type: "object",
                        properties: {
                          name: {
                            type: "string",
                          },
                        },
                      },
                      created_at: {
                        type: "string",
                      },
                      updated_at: {
                        type: "string",
                      },
                      applicants_count: {
                        type: "number",
                      },
                      has_applied: {
                        type: "boolean",
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
