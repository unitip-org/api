import { swaggerComponentRefs } from "@/lib/swagger/component";
import { swaggerSecurity } from "@/lib/swagger/security";

export const singleOffersPaths = {
  "/api/v1/offers2/single": {
    post: {
      tags: ["Offers"],
      summary: "Membuat penawaran single baru",
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
                "delivery_area",
                "pickup_area",
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
                  enum: ["antar-jemput"],
                  description: "Tipe penawaran",
                },
                available_until: {
                  type: "string",
                  format: "date-time",
                  description: "Batas waktu penawaran tersedia",
                },
                price: {
                  type: "number",
                  minimum: 0,
                  description: "Harga penawaran",
                },
                delivery_area: {
                  type: "string",
                  description: "Area pengantaran",
                },
                pickup_area: {
                  type: "string",
                  description: "Area penjemputan",
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
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
          content: {
            "application/json": {
              schema: {
                $ref: swaggerComponentRefs.BadRequestError,
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
        403: {
          content: {
            "application/json": {
              schema: {
                $ref: swaggerComponentRefs.ForbiddenError,
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
            default: 1,
            minimum: 1,
          },
          description: "Halaman yang ingin ditampilkan",
        },
        {
          name: "limit",
          in: "query",
          schema: {
            type: "integer",
            default: 10,
          },
          description: "Jumlah data per halaman",
        },
      ],
      responses: {
        200: {
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
                        id: { type: "string" },
                        title: { type: "string" },
                        description: { type: "string" },
                        type: { type: "string" },
                        delivery_area: { type: "string" },
                        pickup_area: { type: "string" },
                        available_until: {
                          type: "string",
                          format: "date-time",
                        },
                        price: { type: "number" },
                        offer_status: { type: "string" },
                        freelancer_name: { type: "string" },
                        created_at: { type: "string" },
                        updated_at: { type: "string" },
                      },
                    },
                  },
                  page_info: {
                    type: "object",
                    properties: {
                      count: { type: "integer" },
                      page: { type: "integer" },
                      total_pages: { type: "integer" },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          content: {
            "application/json": {
              schema: {
                $ref: swaggerComponentRefs.BadRequestError,
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
        403: {
          content: {
            "application/json": {
              schema: {
                $ref: swaggerComponentRefs.ForbiddenError,
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
