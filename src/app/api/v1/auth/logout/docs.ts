import { swaggerComponentRefs } from "@/lib/swagger/component";
import { swaggerSecurity } from "@/lib/swagger/security";

export const authLogoutPaths = {
  "/api/v1/auth/logout": {
    delete: {
      tags: ["Auth"],
      security: swaggerSecurity,
      responses: {
        "200": {
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
        "401": {
          content: {
            "application/json": {
              schema: {
                $ref: swaggerComponentRefs.UnauthorizedError,
              },
            },
          },
        },
        "500": {
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
