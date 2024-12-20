export const swaggerComponentRefs = {
  BadRequestError: "#/components/schemas/BadRequestError",
  UnauthorizedError: "#/components/schemas/UnauthorizedError",
  ForbiddenError: "#/components/schemas/ForbiddenError",
  NotFoundError: "#/components/schemas/NotFoundError",
  ConflictError: "#/components/schemas/ConflictError",
  InternalServerError: "#/components/schemas/InternalServerError",

  PageInfo: "#/components/schemas/PageInfo",
};

export const swaggerComponents = {
  BadRequestError: {
    type: "object",
    properties: {
      errors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            path: {
              type: "string",
            },
            message: {
              type: "string",
            },
          },
        },
      },
    },
  },
  UnauthorizedError: {
    type: "object",
    properties: {
      message: {
        type: "string",
      },
    },
  },
  ForbiddenError: {
    type: "object",
    properties: {
      message: {
        type: "string",
      },
    },
  },
  NotFoundError: {
    type: "object",
    properties: {
      message: {
        type: "string",
      },
    },
  },
  ConflictError: {
    type: "object",
    properties: {
      message: {
        type: "string",
      },
    },
  },
  InternalServerError: {
    type: "object",
    properties: {
      message: {
        type: "string",
      },
    },
  },
  PageInfo: {
    type: "object",
    properties: {
      count: {
        type: "number",
      },
      page: {
        type: "number",
      },
      total_pages: {
        type: "number",
      },
    },
  },
};
