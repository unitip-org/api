import { swaggerSecurity } from "@/lib/swagger/security";

export const offers2Paths = {
  "/api/v1/offers": {
    get: {
      operationId: "get all offers",
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
                required: ["offers", "page_info"],
                properties: {
                  offers: {
                    type: "array",
                    items: {
                      type: "object",
                      required: [
                        "id",
                        "title",
                        "description",
                        "type",
                        "pickup_area",
                        "destination_area",
                        "available_until",
                        "price",
                        "offer_status",
                        "max_participants",
                        "freelancer",
                        "created_at",
                        "updated_at",
                      ],
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
                        pickup_area: {
                          type: "string",
                          description:
                            "Area penjemputan untuk antar-jemput atau area belanja untuk jasa-titip",
                        },
                        destination_area: {
                          type: "string",
                          description:
                            "Area tujuan untuk antar-jemput atau area pengantaran untuk jasa-titip",
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
                        max_participants: {
                          type: "integer",
                          minimum: 1,
                        },
                        freelancer: {
                          type: "object",
                          requred: ["name"],
                          properties: {
                            id: {
                              type: "string",
                            },
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
                    required: ["count", "page", "total_pages"],
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
          description: "Unauthorized",
        },
        500: {
          description: "Internal Server Error",
        },
      },
    },
    post: {
      operationId: "createOffer",
      tags: ["Offer"],
      summary: "Membuat penawaran baru",
      security: swaggerSecurity,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: [
                "title",
                "description",
                "type",
                "available_until",
                "price",
                "pickup_area",
                "destination_area",
                "max_participants",
              ],
              properties: {
                title: {
                  type: "string",
                  minLength: 1,
                },
                description: {
                  type: "string",
                  minLength: 1,
                },
                type: {
                  type: "string",
                  enum: ["antar-jemput", "jasa-titip"],
                  "x-enum-varnames": ["AntarJemput", "JasaTitip"],
                },
                available_until: {
                  type: "string",
                  format: "date-time",
                },
                price: {
                  type: "number",
                  minimum: 0,
                },
                pickup_area: {
                  type: "string",
                },
                destination_area: {
                  type: "string",
                },
                max_participants: {
                  type: "integer",
                  minimum: 1,
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Successful response",
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["message", "data"],
                properties: {
                  message: {
                    type: "string",
                  },
                  data: {
                    type: "object",
                    required: ["success", "id"],
                    properties: {
                      succes: {
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
        400: {
          description: "Bad Request",
        },
        401: {
          description: "Unauthorized",
        },
        403: {
          description: "Forbidden",
        },
        500: {
          description: "Internal Server Error",
        },
      },
    },
  },
};
