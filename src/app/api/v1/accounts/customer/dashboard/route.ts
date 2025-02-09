import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { NextRequest } from "next/server";

// endpoint untuk mendapatkan seluruh pekerjaan yang perlu di acc customer dan yang sedang berlangsung
interface Order {
  id: string;
  note: string;
}

interface GETResponse {
  need_action: Order[];
  ongoing: Order[];
}
export const GET = async (request: NextRequest) => {
  try {
    // verifikasi bearer token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();
    const { userId, role } = authorization;

    // verifikasi role user
    if (role !== "customer")
      return APIResponse.respondWithForbidden(
        "Anda tidak memiliki akses untuk melakukan aksi ini!"
      );

    // query
    const query = database
      .selectFrom("users as u")
      .select((eb) => [
        // query untuk mendapatkan daftar job yang perlu di acc
        jsonArrayFrom(
          eb
            .selectFrom("jobs as j")
            .select(["j.id", "j.note"])
            .where("j.status", "=", "")
            .where("j.customer", "=", userId as any)
        ).as("need_action"),

        // query untuk mendapatkan daftar job yang sedang berlangsung
        jsonArrayFrom(
          eb
            .selectFrom("jobs as j")
            .select(["j.id", "j.note"])
            .where("j.status", "!=", "")
            .where("j.status", "!=", "done")
            .where("j.customer", "=", userId as any)
        ).as("ongoing"),
      ])
      .where("u.id", "=", userId);

    const result = await query.execute();
    return APIResponse.respondWithSuccess<GETResponse>({
      need_action: result[0].need_action.map((it) => ({
        id: it.id,
        note: it.note,
      })),
      ongoing: result[0].ongoing.map((it) => ({
        id: it.id,
        note: it.note,
      })),
    });
  } catch (e) {
    return APIResponse.respondWithServerError;
  }
};
