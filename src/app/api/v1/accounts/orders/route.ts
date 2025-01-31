import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { sql } from "kysely";
import { NextRequest } from "next/server";

interface GETResponse {
  orders: {
    id: string;
    title: string;
    note: string;
    created_at: string;
    updated_at: string;
  }[];
}
export const GET = async (request: NextRequest) => {
  try {
    // validasi bearer token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();
    const { userId, role } = authorization;

    // verifikasi role user
    if (role !== "customer")
      return APIResponse.respondWithForbidden(
        "Anda tidak memiliki akses untuk mengakses endpoint ini"
      );

    // query ke database
    const query = database
      .selectFrom("jobs as j")
      .select([
        "j.id",
        "j.title",
        "j.note",
        sql<string>`j."xata.createdAt"`.as("created_at"),
        sql<string>`j."xata.updatedAt"`.as("updated_at"),
      ])
      .where("j.customer", "=", userId as any)
      .orderBy("created_at", "desc");
    const result = await query.execute();

    return APIResponse.respondWithSuccess<GETResponse>({
      orders: result,
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
};
