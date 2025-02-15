import { swaggerSecurity } from "@/lib/swagger/security";

export const jobsPaths = {
  "/api/v1/jobs": {
    post: {
      operationId: "createJob",
      tags: ["Job"],
      summary: "membuat job baru",
      description: "endpoint ini digunakan untuk membuat job baru",
      security: swaggerSecurity,
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: [
                "note",
                "pickup_location",
                "destination_location",
                "service",
                "expected_price",
              ],
              properties: {
                note: { type: "string" },
                pickup_location: { type: "string" },
                destination_location: { type: "string" },
                service: {
                  type: "string",
                  enum: ["antar-jemput", "jasa-titip"],
                  "x-enum-varnames": ["AntarJemput", "JasaTitip"],
                },
                expected_price: { type: "integer" },
              },
            },
          },
        },
      },
      responses: {},
    },
    get: {
      operationId: "getAllJobs",
      tags: ["Job"],
      summary: "mendapatkan daftar jobs",
      description:
        "endpoint ini digunakan untuk mendapatkan semua daftar jobs baik single maupun multi",
      security: swaggerSecurity,
      parameters: [
        {
          in: "query",
          name: "limit",
          schema: {
            type: "number",
          },
          required: false,
          default: 10,
        },
        {
          in: "query",
          name: "page",
          schema: {
            type: "number",
          },
          required: false,
          default: 1,
        },
      ],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["jobs"],
                properties: {
                  jobs: {
                    type: "array",
                    items: {
                      type: "object",
                      required: [
                        "id",
                        "note",
                        "pickup_location",
                        "destination_location",
                        "service",
                        "expected_price",
                        "created_at",
                        "updated_at",
                        "customer",
                      ],
                      properties: {
                        id: { type: "string" },
                        note: { type: "string" },
                        pickup_location: { type: "string" },
                        destination_location: { type: "string" },
                        service: {
                          type: "string",
                          enum: ["antar-jemput", "jasa-titip"],
                          "x-enum-varnames": ["AntarJemput", "JasaTitip"],
                        },
                        expected_price: { type: "integer" },
                        created_at: { type: "string", format: "datetime" },
                        updated_at: { type: "string", format: "datetime" },
                        customer: {
                          type: "object",
                          required: ["name"],
                          properties: {
                            name: { type: "string" },
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
