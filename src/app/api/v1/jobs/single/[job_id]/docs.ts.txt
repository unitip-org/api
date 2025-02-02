import { swaggerSecurity } from "@/lib/swagger/security";

export const singleJobByIdPaths = {
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
                  customer_id: { type: "string" },
                  applications: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        freelancer_name: { type: "string" },
                        price: { type: "number" },
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

    patch: {
      tags: ["Single Jobs"],
      security: swaggerSecurity,
      summary: "update job berdasarkan id",
      description:
        "endpoint ini digunakan untuk meng-update single job berdasarkan id",
      parameters: [
        {
          in: "path",
          name: "job_id",
          required: true,
          schema: { type: "string" },
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                destination: { type: "string" },
                note: { type: "string" },
                pickup_location: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "string" },
                },
              },
            },
          },
        },
      },
    },

    delete: {
      tags: ["Single Jobs"],
      security: swaggerSecurity,
      summary: "hapus job berdasarkan id",
      description:
        "endpoint ini digunakan untuk menghapus single job berdasarkan id",
      parameters: [
        {
          in: "path",
          name: "job_id",
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
                },
              },
            },
          },
        },
      },
    },
  },
};
