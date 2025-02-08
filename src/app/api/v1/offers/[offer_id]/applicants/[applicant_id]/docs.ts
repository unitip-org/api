import { swaggerSecurity } from "@/lib/swagger/security";

export const detailApplicantOfferByIdPaths = {
  "/api/v1/offers/{offer_id}/applicants/{applicant_id}": {
    get: {
      tags: ["Offers"],
      security: swaggerSecurity,
      summary: "Detail pelamar",
      description: "Mendapatkan detail pelamar",
      parameters: [
        {
          name: "offer_id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
          description: "ID dari offer yang ingin dilihat pelamarnya",
        },
        {
          name: "applicant_id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
          description: "ID dari offer_applicants yang ingin dilihat detailnya",
        },
      ],
      responses: {
        200: {
          description: "Successful response",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  applicant: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                      },
                      note: {
                        type: "string",
                      },
                      pickup_location: {
                        type: "string",
                      },
                      destination_location: {
                        type: "string",
                      },
                      pickup_latitude: {
                        type: "number",
                      },
                      pickup_longitude: {
                        type: "number",
                      },
                      destination_latitude: {
                        type: "number",
                      },
                      destination_longitude: {
                        type: "number",
                      },
                      customer: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                          },
                          name: {
                            type: "string",
                          },
                        },
                      },
                      applicant_status: {
                        type: "string",
                      },
                      final_price: {
                        type: "number",
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
      tags: ["Offers"],
      security: swaggerSecurity,
      summary: "Update status pelamar",
      description: "Mengupdate status pelamar",
      parameters: [
        {
          name: "offer_id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
          description: "ID dari offer yang ingin dilihat pelamarnya",
        },
        {
          name: "applicant_id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
          description: "ID dari offer_applicants yang ingin dilihat detailnya",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: {
                  type: "string",
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
                properties: {
                  success: {
                    type: "boolean",
                  },
                  message: {
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
};
