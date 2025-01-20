import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { NextRequest } from "next/server";
import { z } from "zod";

interface Params {
  params: {
    room_id: string;
  };
}

interface PATCHBody {
  last_read_message_id: string;
}
interface PATCHResponse {
  id: string;
  room_id: string;
  user_id: string;
  last_read_message_id: string;
}
export const PATCH = async (request: NextRequest, { params }: Params) => {
  try {
    // validasi request dari user
    const { last_read_message_id: lastReadMessageId }: PATCHBody =
      await request.json();
    const { room_id: roomId } = params;

    const validate = z
      .object({
        lastReadMessageId: z
          .string({
            required_error: "ID pesan terakhir dibaca tidak boleh kosong!",
          })
          .min(1, "ID pesan terakhir dibaca tidak boleh kosong!"),
        roomId: z
          .string({ required_error: "ID ruangan tidak boleh kosong!" })
          .min(1, "ID ruangan tidak boleh kosong!"),
      })
      .safeParse({ lastReadMessageId, roomId });
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

    // update last read message berdasarkan id
    const query = database
      .updateTable("chat_room_members")
      .set({ last_read_message: lastReadMessageId as any })
      .where("chat_room_members.room", "=", roomId as any)
      .where("chat_room_members.user", "=", userId as any)
      .returning("chat_room_members.id");
    const result = await query.executeTakeFirstOrThrow();

    return APIResponse.respondWithSuccess<PATCHResponse>({
      id: result.id,
      room_id: roomId,
      user_id: userId,
      last_read_message_id: lastReadMessageId,
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
};
