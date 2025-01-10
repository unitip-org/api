import { swaggerComponentRefs } from "@/lib/swagger/component";
import { swaggerSecurity } from "@/lib/swagger/security";

export const acceptanceOffersByIdPaths = {
  "/api/v1/offers/{offer_id}/acceptance/{request_id}/acceptence": {
    post: {
      tags: ["Offers"],
      security: swaggerSecurity,
      parameters: [
        {
          in: "path",
          name: "offer_id",
          schema: { type: "string" },
          required: true,
        },
        {
          in: "path",
          name: "request_id",
          schema: { type: "string" },
          required: true,
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                note: {
                  type: "string",
                },
                delivery: {
                  type: "string",
                },
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
        404: {
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
