import { swaggerComponentRefs } from "@/lib/swagger/component";
import { swaggerSecurity } from "@/lib/swagger/security";

export const jobByIdPaths = {
  "/api/v1/jobs/single/{job_id}": {
    get: {
      tags: ["Single Jobs"],
      summary: "medapatkan job berdasarkan id",
      description:
        "endpoint ini digunakan untuk mendapatkan single job berdasarkan id",
      security: swaggerSecurity,
      parameters: [
        {
          in: "path",
          name: "job_id",
          required: true,
          schema: { type: "string" },
        },
        {
          in: "query",
          name: "type",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  title: { type: "string" },
                  destination: { type: "string" },
                  note: { type: "string" },
                  service: { type: "string" },
                  pickup_location: { type: "string" },
                  created_at: { type: "string" },
                  updated_at: { type: "string" },
                  applicants: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        price: { type: "number" },
                      },
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
        404: {
          content: {
            "application/json": {
              schema: {
                $ref: swaggerComponentRefs.NotFoundError,
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

    patch: {
      tags: ["Single Jobs"],
      security: swaggerSecurity,
      summary: "update job berdasarkan id",
      description:
        "endpoint ini digunakan untuk meng-update single job berdasarkan id",
    },

    delete: {
      tags: ["Single Jobs"],
      security: swaggerSecurity,
      summary: "hapus job berdasarkan id",
      description:
        "endpoint ini digunakan untuk menghapus single job berdasarkan id",
    },
  },
};
