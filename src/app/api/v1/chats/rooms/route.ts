import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { convertDatetimeToISO } from "@/lib/utils";
import { sql } from "kysely";
import { NextRequest } from "next/server";
import { z } from "zod";

interface Room {
  id: string;
  other_user_name: string;
  last_message: string;
  last_sent_user_id: string;
  created_at: string;
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

    // validasi request dari user
    const validate = z
      .object({
        userId: z
          .string({ required_error: "ID pengguna tidak boleh kosong!" })
          .min(1, "ID pengguna tidak boleh kosong!"),
      })
      .safeParse({ userId });
    if (!validate.success)
      return APIResponse.respondWithBadRequest(
        validate.error.errors.map((it) => ({
          path: it.path[0] as string,
          message: it.message,
        }))
      );

    // mendapatkan daftar room chats dari database
    const query = database
      .selectFrom("chat_rooms as cr")
      .innerJoin("chat_room_members as crm", "crm.room", "cr.id")
      .innerJoin("users as u", "u.id", "crm.user")
      // subquery untuk mendapatkan nama user lain
      .select((qb) =>
        qb
          .selectFrom("chat_room_members as crm2")
          .innerJoin("users as u2", "u2.id", "crm2.user")
          .select("u2.name")
          .whereRef("crm2.room", "=", "cr.id")
          .where("crm2.user", "!=", userId as any)
          .limit(1)
          .as("other_user_name")
      )
      .select([
        "cr.id",
        "cr.last_message",
        "cr.last_sent_user as last_sent_user_id",
      ])
      .select(sql`cr."xata.createdAt"`.as("created_at"))
      .select(sql`cr."xata.updatedAt"`.as("updated_at"))
      .where("crm.user", "=", userId as any)
      .orderBy("updated_at", "asc");
    const result = await query.execute();

    return APIResponse.respondWithSuccess<GETResponse>({
      rooms: result.map((it) => ({
        ...(it as any),
        created_at: convertDatetimeToISO(it.created_at as string),
        updated_at: convertDatetimeToISO(it.updated_at as string),
      })),
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
}
