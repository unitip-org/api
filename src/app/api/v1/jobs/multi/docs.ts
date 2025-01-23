import { swaggerSecurity } from "@/lib/swagger/security";

export const multiJobPaths = {
  "/api/v1/jobs/multi": {
    post: {
      tags: ["Multi Jobs"],
      security: swaggerSecurity,
    },
  },
};
