import { swaggerComponentRefs } from "@/lib/swagger/component";
import { swaggerSecurity } from "@/lib/swagger/security";

export const jobsPaths = {
  "/api/v1/jobs": {
    post: {
      tags: ["Jobs"],
      security: swaggerSecurity,
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                },
                destination: {
                  type: "string",
                },
                note: {
                  type: "string",
                },
                type: {
                  type: "string",
                },
                pickup_location: {
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
    get: {
      tags: ["Jobs"],
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
                properties: {
                  jobs: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                        },
                        title: {
                          type: "string",
                        },
                        destination: {
                          type: "string",
                        },
                        note: {
                          type: "string",
                        },
                        type: {
                          type: "string",
                        },
                        pickup_location: {
                          type: "string",
                        },
                        created_at: {
                          type: "string",
                        },
                        updated_at: {
                          type: "string",
                        },
                        customer: {
                          type: "object",
                          properties: {
                            name: {
                              type: "string",
                            },
                          },
                        },
                      },
                    },
                  },
                  page_info: {
                    $ref: swaggerComponentRefs.PageInfo,
                  },
                },
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
