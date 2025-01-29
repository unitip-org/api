import { swaggerComponentRefs } from "@/lib/swagger/component";
import { swaggerSecurity } from "@/lib/swagger/security";

export const applyOfferByIdPaths = {
  "/api/v1/offers/{offer_id}/apply": {
    post: {
      tags: ["Offers"],
      security: swaggerSecurity,
      summary: "Apply ke single offer",
      description: "Apply ke single offer yang tersedia",
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
                "destination_location",
                "pickup_location",
                "pickup_latitude",
                "pickup_longitude",
                "destination_latitude",
                "destination_longitude",
              ],
              properties: {
                note: {
                  type: "string",
                  minLength: 5,
                  description: "Note for the order",
                },
                destination_location: {
                  type: "string",
                  minLength: 5,
                  description: "Destination location",
                },
                pickup_location: {
                  type: "string",
                  minLength: 5,
                  description: "Pickup location",
                },
                pickup_latitude: {
                  type: "number",
                  description: "Latitude of pickup location",
                },
                pickup_longitude: {
                  type: "number",
                  description: "Longitude of pickup location",
                },
                destination_latitude: {
                  type: "number",
                  description: "Latitude of destination location",
                },
                destination_longitude: {
                  type: "number",
                  description: "Longitude of destination location",
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
