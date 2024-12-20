import { authLoginPaths } from "@/app/api/v1/auth/login/docs";
import { authLogoutPaths } from "@/app/api/v1/auth/logout/docs";
import { authRegisterPaths } from "@/app/api/v1/auth/register/docs";
import { jobsPaths } from "@/app/api/v1/jobs/docs";
import { swaggerComponents } from "./component";
import { swaggerSecuritySchemes } from "./security";

export const swaggerSpec = {
  openapi: "3.1.0",
  info: { title: "Unitip API Documentation", version: "1.0" },
  components: {
    securitySchemes: swaggerSecuritySchemes,
    schemas: swaggerComponents,
  },
  paths: {
    ...authLoginPaths,
    ...authLogoutPaths,
    ...authRegisterPaths,

    ...jobsPaths,
  },
};
