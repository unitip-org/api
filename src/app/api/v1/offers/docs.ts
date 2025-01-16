import { swaggerComponentRefs } from "@/lib/swagger/component";
import { swaggerSecurity } from "@/lib/swagger/security";

export const offersPaths = {
  "/api/v1/offers": {
    post: {
      tags: ["Offers"],
      security: swaggerSecurity,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: [
                "title",
                "type",
                "available_until",
                "price",
                "location",
              ],
              properties: {
                title: {
                  type: "string",
                  description: "Judul penawaran",
                },
                description: {
                  type: "string",
                  description: "Deskripsi penawaran",
                },
                type: {
                  type: "string",
                  enum: ["antar-jemput", "jasa-titip"],
                  description: "Tipe penawaran",
                },
                pickup_area: {
                  type: "string",
                  format: "date-time",
                  description: "Waktu berakhir penawaran",
                },
                price: {
                  type: "number",
                  minimum: 0,
                  description: "Harga penawaran",
                },
                location: {
                  type: "string",
                  description: "Lokasi",
                },
                available_until: {
                  type: "string",
                  description: "Area pengiriman (opsional)",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Berhasil membuat penawaran",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
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
        400: {
          description: "Input tidak valid",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  errors: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        message: {
                          type: "string",
                        },
                        path: {
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
        401: {
          description: "Unauthorized",
        },
        403: {
          description: "Forbidden - Role tidak memiliki akses",
        },
        500: {
          description: "Server error",
        },
      },
    },
    get: {
      tags: ["Offers"],
      security: swaggerSecurity,
      parameters: [
        {
          name: "page",
          in: "query",
          schema: {
            type: "integer",
            default: 1,
          },
          description: "Halaman yang diminta",
        },
        {
          name: "limit",
          in: "query",
          schema: {
            type: "integer",
            default: 10,
          },
          description: "Jumlah item per halaman",
        },
        {
          name: "type",
          in: "query",
          schema: {
            type: "string",
            enum: ["all", "single", "multi"],
            default: "all",
          },
          description: "Filter berdasarkan tipe penawaran",
        },
      ],
      responses: {
        200: {
          description: "Daftar penawaran berhasil diambil",
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
                        },
                        available_until: {
                          type: "string",
                          format: "date-time",
                        },
                        price: {
                          type: "number",
                        },
                        location: {
                          type: "string",
                        },
                        delivery_area: {
                          type: "string",
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
                      },
                      page: {
                        type: "integer",
                      },
                      total_pages: {
                        type: "integer",
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
          description: "Server error",
        },
      },
    },
  },
};
