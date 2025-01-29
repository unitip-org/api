import { swaggerComponentRefs } from "@/lib/swagger/component";
import { swaggerSecurity } from "@/lib/swagger/security";

export const applicantsOfferPaths = {
  "/api/v1/offers2/{offer_id}/applicants": {
    get: {
      tags: ["Offers"],
      summary: "Mendapatkan daftar pelamar",
      security: swaggerSecurity,
      parameters: [
        {
          name: "offer_id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
          description: "ID dari offer yang ingin dilihat pelamarnya",
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
                  applicants: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                        },
                        note: {
                          type: "string",
                        },
                        pickup_location: {
                          type: "string",
                        },
                        destination_location: {
                          type: "string",
                        },
                        pickup_latitude: {
                          type: "number",
                        },
                        pickup_longitude: {
                          type: "number",
                        },
                        destination_latitude: {
                          type: "number",
                        },
                        destination_longitude: {
                          type: "number",
                        },
                        customer: {
                          type: "object",
                          properties: {
                            id: {
                              type: "string",
                            },
                            name: {
                              type: "string",
                            },
                            phone_number: {
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
    },
  },
};
