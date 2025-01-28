import { swaggerComponentRefs } from "@/lib/swagger/component";
import { swaggerSecurity } from "@/lib/swagger/security";

export const offers2Paths = {
  "/api/v1/offers2": {
    get: {
      tags: ["Offers"],
      summary: "Mendapatkan daftar penawaran All",
      security: swaggerSecurity,
      parameters: [
        {
          in: "query",
          name: "page",
          schema: {
            type: "integer",
            default: 1,
            minimum: 1,
          },
          description: "Nomor halaman",
        },
        {
          in: "query",
          name: "limit",
          schema: {
            type: "integer",
            default: 10,
          },
          description: "Jumlah data per halaman",
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
                  offers: {
                    type: "array",
                    items: {
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
                          enum: ["jasa-titip", "antar-jemput"],
                        },
                        pickup_location: {
                          type: "string",
                          nullable: true,
                        },
                        delivery_area: {
                          type: "string",
                          nullable: true,
                        },
                        pickup_area: {
                          type: "string",
                          nullable: true,
                        },
                        available_until: {
                          type: "string",
                          format: "date-time",
                        },
                        price: {
                          type: "number",
                        },
                        offer_status: {
                          type: "string",
                          nullable: true,
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
                          format: "date-time",
                        },
                        updated_at: {
                          type: "string",
                          format: "date-time",
                        },
                      },
                    },
                  },
                  page_info: {
                    type: "object",
                    properties: {
                      count: {
                        type: "integer",
                        description: "Jumlah data pada halaman ini",
                      },
                      page: {
                        type: "integer",
                        description: "Halaman saat ini",
                      },
                      total_pages: {
                        type: "integer",
                        description: "Total jumlah halaman",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          content: {
            "application/json": {
              schema: {
                $ref: swaggerComponentRefs.UnauthorizedError,
              },
            },
          },
        },
        500: {
          content: {
            "application/json": {
              schema: {
                $ref: swaggerComponentRefs.InternalServerError,
              },
            },
          },
        },
      },
    },
  },
};
