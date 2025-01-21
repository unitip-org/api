import { verifyBearerToken } from "@/lib/bearer-token";
import { database, xata } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { convertDatetimeToISO } from "@/lib/utils";
import { sql } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { NextRequest } from "next/server";
import { z } from "zod";

interface Params {
  params: {
    room_id: string;
  };
}

interface POSTBody {
  id: string;
  message: string;
  other_id: string;
  other_unread_message_count: number;
}
interface POSTResponse {
  id: string;
  message: string;
  created_at: string;
  updated_at: string;
}
export const POST = async (request: NextRequest, { params }: Params) => {
  try {
    // validasi request dari user
    const {
      id,
      message,
      other_id: otherId,
      other_unread_message_count: otherUnreadMessageCount,
    }: POSTBody = await request.json();
    const { room_id: roomId } = params;

    const validate = z
      .object({
        id: z
          .string({ required_error: "ID pesan tidak boleh kosong!" })
          .min(1, "ID pesan tidak boleh kosong!"),
        message: z
          .string({ required_error: "Pesan tidak boleh kosong!" })
          .min(1, "Pesan tidak boleh kosong!"),
        roomId: z
          .string({ required_error: "ID ruangan tidak boleh kosong!" })
          .min(1, "ID ruangan tidak boleh kosong!"),
      })
      .safeParse({ id, message, roomId });
    if (!validate.success)
      return APIResponse.respondWithBadRequest(
        validate.error.errors.map((it) => ({
          path: it.path[0] as string,
          message: it.message,
        }))
      );

    // verifikasi bearer token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();
    const { userId } = authorization;

    // mengirim pesan menggunakan transaction
    const transactionResult = await xata.transactions.run([
      // mengirim pesan
      {
        insert: {
          table: "chat_messages",
          createOnly: true,
          record: {
            id,
            message,
            is_deleted: false,
            room: roomId,
            user: userId,
          },
        },
      },

      // memperbarui room chat
      {
        update: {
          table: "chat_rooms",
          upsert: false,
          id: roomId,
          fields: {
            last_message: message,
            last_sent_user: userId,
          },
        },
      },

      // memperbarui unread message count milik other user
      {
        update: {
          table: "chat_room_members",
          upsert: false,
          id: `${roomId}_${otherId}`,
          fields: {
            unread_message_count: otherUnreadMessageCount,
          },
        },
      },
    ]);

    // check jika terdapat error pada transaction
    if (transactionResult.results.length !== 3)
      return APIResponse.respondWithServerError();

    // kembalikan response success
    const currentDatetime = new Date();
    return APIResponse.respondWithSuccess<POSTResponse>({
      id: transactionResult.results[0].id,
      message,
      created_at: currentDatetime.toISOString(),
      updated_at: currentDatetime.toISOString(),
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
};

interface GETResponse {
  other_user: {
    id: string;
    last_read_message_id: string;
  };
  messages: {
    id: string;
    message: string;
    is_deleted: boolean;
    room_id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
  }[];
}
export const GET = async (request: NextRequest, { params }: Params) => {
  try {
    // validasi request dari user
    const { room_id: roomId } = params;

    const validate = z
      .object({
        roomId: z
          .string({ required_error: "ID ruangan tidak boleh kosong!" })
          .min(1, "ID ruangan tidak boleh kosong!"),
      })
      .safeParse({ roomId });
    if (!validate.success)
      return APIResponse.respondWithBadRequest(
        validate.error.errors.map((it) => ({
          path: it.path[0] as string,
          message: it.message,
        }))
      );

    // verifikasi bearer token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();
    const { userId } = authorization;

    // mendapatkan daftar pesan berdasarkan room id dan user id
    const query = database
      .selectFrom("chat_rooms as cr")
      .select((eb) => [
        // query untuk mendapatkan daftar members dan last read message id
        jsonObjectFrom(
          eb
            .selectFrom("chat_room_members as crm")
            .select([
              "crm.user as id",
              "crm.last_read_message as last_read_message_id",
            ])
            .whereRef("crm.room", "=", "cr.id")
            .where("crm.user", "!=", userId as any)
            .limit(1)
        ).as("other_user"),

        // query untuk mendapatkan daftar messages dari room
        jsonArrayFrom(
          eb
            .selectFrom("chat_messages as cm")
            .select([
              "cm.id",
              "cm.message",
              "cm.is_deleted",
              "cm.room as room_id",
              "cm.user as user_id",
            ])
            .select(sql<string>`cm."xata.createdAt"`.as("created_at"))
            .select(sql<string>`cm."xata.updatedAt"`.as("updated_at"))
            .whereRef("cm.room", "=", "cr.id")
            .orderBy("created_at", "asc")
        ).as("messages"),
      ])
      .where("cr.id", "=", roomId)
      .limit(1);

    // old query
    // const query = database
    //   .selectFrom("chat_messages as cm")
    //   .select((eb) => [
    //     "cm.id",
    //     "cm.message",
    //     "cm.is_deleted",
    //     "cm.room as room_id",
    //     "cm.user as user_id",
    //   ])
    //   .select(sql<string>`cm."xata.createdAt"`.as("created_at"))
    //   .select(sql<string>`cm."xata.updatedAt"`.as("updated_at"))
    //   .where("cm.room", "=", roomId as any)
    //   .orderBy("created_at", "asc");
    const result = await query.executeTakeFirstOrThrow();

    // kembalikan response success
    return APIResponse.respondWithSuccess<GETResponse>({
      other_user: result.other_user as any,
      messages: result.messages.map((it) => ({
        ...(it as any),
        created_at: convertDatetimeToISO(it.created_at),
        updated_at: convertDatetimeToISO(it.updated_at),
      })),
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
};
