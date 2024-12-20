export const swaggerSecurity = [
  {
    BearerAuth: [],
  },
];

export const swaggerSecuritySchemes = {
  BearerAuth: {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
  },
};
