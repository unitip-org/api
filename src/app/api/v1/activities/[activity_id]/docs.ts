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
      parameters,
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id", "content", "children"],
                properties: {
                  id: { type: "string" },
                  content: { type: "string" },
                  children: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["id", "content"],
                      properties: {
                        id: { type: "string" },
                        content: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    patch: {},
    delete: {},
  },
};
