import { swaggerComponentRefs } from "@/lib/swagger/component";
import { swaggerSecurity } from "@/lib/swagger/security";

export const applyMultiOfferByIdPaths = {
  "/api/v1/offers2/multi/{offer_id}/apply": {
    post: {
      tags: ["Offers"],
      security: swaggerSecurity,
      summary: "Apply ke multi offer",
      description: "Apply ke multi offer yang tersedia",
      parameters: [
        {
          name: "offer_id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
          description: "ID dari offer yang ingin di-apply",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: [
                "note",
                "delivery_location",
                "payment_method",
                "offer_type",
              ],
              properties: {
                note: {
                  type: "string",
                  minLength: 5,
                  description: "Note for the order",
                },
                delivery_location: {
                  type: "string",
                  minLength: 5,
                  description: "Delivery location address",
                },
                payment_method: {
                  type: "string",
                  description: "Payment method",
                },
                offer_type: {
                  type: "string",
                  enum: ["multi"],
                  description: "Type of offer (multi)",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Successfully applied to offer",
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
                    description: "ID of the created application",
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
