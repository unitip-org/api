import { swaggerComponentRefs } from "@/lib/swagger/component";
import { swaggerSecurity } from "@/lib/swagger/security";

export const applyOfferByIdPaths = {
  "/api/v1/offers/{offer_id}/apply": {
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
        409: {
          content: {
            "application/json": {
              schema: {
                $ref: swaggerComponentRefs.ConflictError,
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
