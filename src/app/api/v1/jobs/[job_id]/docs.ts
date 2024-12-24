import { swaggerComponentRefs } from "@/lib/swagger/component";
import { swaggerSecurity } from "@/lib/swagger/security";

export const jobByIdPaths = {
  "/api/v1/jobs/{job_id}": {
    get: {
      tags: ["Jobs"],
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
                  type: { type: "string" },
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
  },
};
