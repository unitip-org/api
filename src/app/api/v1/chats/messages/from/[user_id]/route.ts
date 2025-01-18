import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { sql } from "kysely";
import { NextRequest } from "next/server";
import { z } from "zod";

interface Message {
  id: string;
  from_user_id: string;
  to_user_id: string;
  message: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

interface GETResponse {
  messages: Message[];
}
export async function GET(
  request: NextRequest,
  { params }: { params: { user_id: string } }
) {
  try {
    // validasi request dari user
    const { user_id: fromUserId } = params;
    const validate = z
      .object({
        fromUserId: z
          .string({ required_error: "ID pengirim tidak boleh kosong!" })
          .min(1, "ID pengirim tidak boleh kosong!"),
      })
      .safeParse({ fromUserId });
    if (!validate.success)
      return APIResponse.respondWithBadRequest(
        validate.error.errors.map((it) => ({
          path: it.path[0] as string,
          message: it.message,
        }))
      );

    // validasi bearer token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();
    const { userId } = authorization;

    // mendapatkan semua pesan berdasarkan user id dan from user id
    const query = database
      .selectFrom("chat_messages as cm")
      .select([
        "cm.id",
        "cm.from as from_user_id",
        "cm.to as to_user_id",
        "cm.message",
        "cm.is_deleted",
      ])
      .select(sql<string>`cm."xata.createdAt"`.as("created_at"))
      .select(sql<string>`cm."xata.updatedAt"`.as("updated_at"))
      .where((qb) =>
        qb.or([
          qb("cm.from", "=", fromUserId as any).and(
            "cm.to",
            "=",
            userId as any
          ),
          qb("cm.to", "=", fromUserId as any).and(
            "cm.from",
            "=",
            userId as any
          ),
        ])
      )
      .orderBy("created_at", "asc");
    const result = await query.execute();

    return APIResponse.respondWithSuccess<GETResponse>({
      messages: result.map((it) => ({
        id: it.id,
        from_user_id: it.from_user_id as any,
        to_user_id: it.to_user_id as any,
        message: it.message,
        is_deleted: it.is_deleted,
        created_at: new Date(Date.parse(it.created_at)).toISOString(),
        updated_at: new Date(Date.parse(it.updated_at)).toISOString(),
      })),
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
}
