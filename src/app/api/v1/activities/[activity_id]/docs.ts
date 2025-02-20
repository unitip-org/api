import { swaggerSecurity } from "@/lib/swagger/security";

const parameters = [
  {
    in: "path",
    name: "activity_id",
    required: "true",
    schema: { type: "string" },
  },
];

export const activitiesIdPaths = {
  "/api/v1/activities/{activity_id}": {
    get: {
      operationId: "getActivity",
      tags: ["Activity"],
      security: swaggerSecurity,
    },
    patch: {},
    delete: {},
  },
};
