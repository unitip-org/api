import { verifyBearerToken } from "@/lib/bearer-token";
import { xata } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { NextRequest } from "next/server";
import { z } from "zod";

interface POSTParams {
  params: {
    room_id: string;
  };
}
interface POSTBody {
  id: string;
  message: string;
}
interface POSTResponse {
  id: string;
  message: string;
  created_at: string;
  updated_at: string;
}
export const POST = async (request: NextRequest, { params }: POSTParams) => {
  try {
    // validasi request dari user
    const { id, message }: POSTBody = await request.json();
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
    ]);

    // check jika terdapat error pada transaction
    if (transactionResult.results.length !== 2)
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
