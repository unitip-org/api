import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { convertDatetimeToISO } from "@/lib/utils";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { NextRequest } from "next/server";
import { z } from "zod";

interface Room {
  id: string;
  last_message: string;
  last_sent_user_id: string;
  created_at: string;
  updated_at: string;
  unread_message_count: number;
  other_user: {
    id: string;
    name: string;
  };
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
      .select((eb) => [
        "cr.id",
        "cr.last_message",
        "cr.last_sent_user as last_sent_user_id",
        "crm.unread_message_count",

        // jika ingin mendapatkan semua member dari sebuah room
        // jsonArrayFrom(
        //   eb
        //     .selectFrom("chat_room_members as crm2")
        //     .innerJoin("users as u2", "u2.id", "crm2.user")
        //     .select(["u2.id as other_user_id", "u2.name as other_user_name"])
        //     .whereRef("crm2.room", "=", "cr.id")
        //     .where("crm2.user", "!=", userId as any)
        // ).as("members"),

        // query untuk mendapatkan data user lain, seperti id dan nama
        jsonObjectFrom(
          eb
            .selectFrom("chat_room_members as crm2")
            .innerJoin("users as u2", "u2.id", "crm2.user")
            .select(["u2.id", "u2.name"])
            .whereRef("crm2.room", "=", "cr.id")
            .where("crm2.user", "!=", userId as any)
            .limit(1)
        ).as("other_user"),
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
