import { swaggerComponentRefs } from "@/lib/swagger/component";
import { swaggerSecurity } from "@/lib/swagger/security";

export const multiOffersPaths = {
  "/api/v1/offers2/multi": {
    post: {
      tags: ["Offers"],
      summary: "Membuat penawaran multi baru",
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
                "pickup_location",
                "delivery_area",
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
                  enum: ["jasa-titip"],
                  description: "Tipe penawaran",
                },
                available_until: {
                  type: "string",
                  format: "date-time",
                  description: "Batas waktu penawaran",
                },
                price: {
                  type: "number",
                  minimum: 0,
                  description: "Biaya penawaran",
                },
                pickup_location: {
                  type: "string",
                  description: "Lokasi pembelian barang",
                },
                delivery_area: {
                  type: "string",
                  description: "Area pengantaran",
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
        
      },
    },
    get: {
      tags: ["Offers"],
      summary: "Mendapatkan daftar penawaran multi",
      security: swaggerSecurity,
      parameters: [
        {
          name: "page",
          in: "query",
          schema: {
            type: "integer",
            minimum: 1,
            default: 1,
          },
          description: "Nomor halaman",
        },
        {
          name: "limit",
          in: "query",
          schema: {
            type: "integer",
            minimum: 1,
            default: 10,
          },
          description: "Jumlah data per halaman",
        },
      ],
      responses: {
        "200": {
          description: "Berhasil mendapatkan daftar penawaran",
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
                        pickup_location: {
                          type: "string",
                        },
                        delivery_area: {
                          type: "string",
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
                        },
                        freelancer_name: {
                          type: "string",
                        },
                        created_at: {
                          type: "string",
                        },
                        updated_at: {
                          type: "string",
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
        
      },
    },
  },
};
