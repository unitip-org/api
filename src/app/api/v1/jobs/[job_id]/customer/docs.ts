import { swaggerSecurity } from "@/lib/swagger/security";

const parameters = [
  {
    in: "path",
    name: "job_id",
    required: true,
    schema: { type: "string" },
  },
];

export const jobsIdCustomerPaths = {
  "/api/v1/jobs/{job_id}/customer": {
    get: {
      operationId: "getJobForCustomer",
      tags: ["Job"],
      security: swaggerSecurity,
      parameters,
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "id",
                  "title",
                  "note",
                  "pickup_location",
                  "destination_location",
                  "expected_price",
                  "price",
                  "service",
                  "status",
                  "applications",
                ],
                properties: {
                  id: { type: "string" },
                  note: { type: "string" },
                  pickup_location: { type: "string" },
                  destination_location: { type: "string" },
                  expected_price: { type: "integer" },
                  price: { type: "integer" },
                  service: {
                    type: "string",
                    enum: ["antar-jemput", "jasa-titip"],
                    "x-enum-varnames": ["AntarJemput", "JasaTitip"],
                  },
                  status: {
                    type: "string",
                    enum: ["", "ongoing", "done"],
                    "x-enum-varnames": ["Initial", "Ongoing", "Done"],
                  },
                  applications: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["id", "bid_price", "bid_note", "driver"],
                      properties: {
                        id: { type: "string" },
                        bid_price: { type: "integer" },
                        bid_note: { type: "string" },
                        driver: {
                          type: "object",
                          required: ["name"],
                          properties: {
                            name: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                  driver: {
                    type: "object",
                    required: ["id", "name"],
                    properties: {
                      id: { type: "string" },
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
};
