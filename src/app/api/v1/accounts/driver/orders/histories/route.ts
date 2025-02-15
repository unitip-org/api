import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { convertDatetimeToISO } from "@/lib/utils";
import { sql } from "kysely";
import { NextRequest } from "next/server";

interface GETResponse {
  orders: {
    id: string;
    // title: string;
    created_at: string;
    updated_at: string;
    customer: {
      name: string;
    };
  }[];
}
export const GET = async (request: NextRequest) => {
  try {
    // verifikasi bearer token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();
    const { role, userId } = authorization;

    // validasi role user
    if (role !== "driver")
      return APIResponse.respondWithForbidden(
        "Anda tidak memiliki akses untuk melakukan aksi ini!"
      );

    // ambil data order
    const query = database
      .selectFrom("jobs as j")
      .innerJoin("users as u", "u.id", "j.customer")
      .select([
        "j.id",

        sql<string>`j."xata.createdAt"`.as("created_at"),
        sql<string>`j."xata.updatedAt"`.as("updated_at"),
        sql<string>`u.name`.as("customer_name"),
      ])
      .where("j.freelancer", "=", userId as any)
      .where("j.status", "=", "done")
      .orderBy("created_at desc");
    const result = await query.execute();

    return APIResponse.respondWithSuccess<GETResponse>({
      orders: result.map((it) => ({
        id: it.id,
        // title: it.title,
        created_at: convertDatetimeToISO(it.created_at),
        updated_at: convertDatetimeToISO(it.updated_at),
        customer: {
          name: it.customer_name,
        },
      })),
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
};
