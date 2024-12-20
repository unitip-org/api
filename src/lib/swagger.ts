import swaggerJsdoc from "swagger-jsdoc";

export const getApiDocs = async () => {
  return swaggerJsdoc({
    definition: {
      openapi: "3.1.0",
      info: {
        title: "Unitip API Documentation",
        version: "1.0",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
    apis: [
      "./src/app/api/v1/**/docs.yaml",
      "./src/app/api/v1/**/component-docs.yaml",
    ],
  });
};
