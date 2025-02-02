import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { convertDatetimeToISO } from "@/lib/utils";
import { sql } from "kysely";
import { NextRequest } from "next/server";

interface GETResponse {
  orders: {
    id: string;
    title: string;
    note: string;
  }[];
}
export const GET = async (request: NextRequest) => {
  try {
    // verifikasi bearer token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();
    const { userId, role } = authorization;

    // verifikasi role user
    if (role !== "driver")
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
      .where("j.freelancer", "=", userId as any)
      .where("j.status", "!=", "done")
      .orderBy("created_at", "desc");
    const result = await query.execute();

    return APIResponse.respondWithSuccess<GETResponse>({
      orders: result.map((it) => ({
        ...it,
        created_at: convertDatetimeToISO(it.created_at),
        updated_at: convertDatetimeToISO(it.updated_at),
      })),
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
};
