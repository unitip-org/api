import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { sql } from "kysely";
import { NextRequest } from "next/server";

interface Room {
  id: string;
  from_user_id: string;
  from_user_name: string;
  to_user_id: string;
  last_message: string;
  last_sent_user_id: string;
  updated_at: string;
}

interface GETResponse {
  rooms: Room[];
}
export async function GET(request: NextRequest) {
  try {
    // validasi bearer token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();

    const { userId } = authorization;

    // mendapatkan daftar room chats dari database
    const query = database
      .selectFrom("chat_rooms as cr")
      .innerJoin("users as u", "u.id", "cr.from_user")
      .select([
        "cr.id",
        "cr.from_user as from_user_id",
        "u.name as from_user_name",
        "cr.to_user as to_user_id",
        "cr.last_message",
        "cr.last_sent_user as last_sent_user_id",
      ])
      .select(sql`cr."xata.updatedAt"`.as("updated_at"))
      .where("cr.to_user", "=", userId as any)
      .orderBy("updated_at", "desc");
    const result = await query.execute();

    return APIResponse.respondWithSuccess<GETResponse>({
      rooms: result as any,
    });
  } catch (e) {
    return APIResponse.respondWithServerError();
  }
}
