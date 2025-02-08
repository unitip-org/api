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
                  "price",
                  "status",
                  "applications",
                ],
                properties: {
                  id: { type: "string" },
                  title: { type: "string" },
                  note: { type: "string" },
                  price: { type: "integer" },
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
