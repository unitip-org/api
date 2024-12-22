import { authLoginPaths } from "@/app/api/v1/auth/login/docs";
import { authLogoutPaths } from "@/app/api/v1/auth/logout/docs";
import { authRegisterPaths } from "@/app/api/v1/auth/register/docs";
import { approveJobByIdPaths } from "@/app/api/v1/jobs/[job_id]/applicants/[applicant_id]/approve/docs";
import { applyJobByIdPaths } from "@/app/api/v1/jobs/[job_id]/apply/docs";
import { jobByIdPaths } from "@/app/api/v1/jobs/[job_id]/docs";
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
    // auth
    ...authLoginPaths,
    ...authLogoutPaths,
    ...authRegisterPaths,

    // jobs
    ...jobsPaths,
    ...jobByIdPaths,
    ...applyJobByIdPaths,
    ...approveJobByIdPaths,
  },
};
