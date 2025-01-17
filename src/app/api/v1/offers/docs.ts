import { swaggerComponentRefs } from "@/lib/swagger/component";
import { swaggerSecurity } from "@/lib/swagger/security";

export const offersPaths = {
  "/api/v1/offers": {
    post: {
      tags: ["Offers"],
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
                available_until: {
                  type: "string",
                  description: "Batas waktu penawaran tersedia",
                },
                price: {
                  type: "number",
                  minimum: 0,
                  description: "Biaya penawaran",
                },
                pickup_area: {
                  type: "string",
                  description: "Area penjemputan (opsional)",
                },
                delivery_area: {
                  type: "string",
                  description: "Area pengantaran (opsional)",
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
                    description: "ID penawaran yang dibuat",
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
      summary: "Mendapatkan daftar penawaran",
      security: swaggerSecurity,
      parameters: [
        {
          in: "query",
          name: "page",
          schema: {
            type: "number",
            default: 1,
          },
          description: "Nomor halaman",
        },
        {
          in: "query",
          name: "limit",
          schema: {
            type: "number",
            default: 10,
          },
          description: "Jumlah data per halaman",
        },
        {
          in: "query",
          name: "type",
          schema: {
            type: "string",
            enum: ["all", "single", "multi"],
            default: "all",
          },
          description: "Filter tipe penawaran",
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
                        pickup_area: {
                          type: "string",
                        },
                        delivery_area: {
                          type: "string",
                        },
                        available_until: {
                          type: "string",
                        },
                        price: {
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
                      },
                    },
                  },
                  page_info: {
                    $ref: swaggerComponentRefs.PageInfo,
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
