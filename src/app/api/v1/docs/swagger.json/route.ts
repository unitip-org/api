import { swaggerSpec } from "@/lib/swagger/spec";

export const GET = async () => {
  return Response.json(swaggerSpec);
};
