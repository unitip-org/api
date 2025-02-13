import { APIResponse } from "@/lib/models/api-response";
import { NextRequest } from "next/server";

interface POSTResponse {
  id: string;
}
export async function POST(
  request: NextRequest,
  { params }: { params: { user_id: string } }
) {
  return APIResponse.respondWithServerError();
  // try {
  //   // validasi request dari user
  //   const { user_id: toUserId } = params;
  //   const { message, id } = await request.json();
  //   const validate = z
  //     .object({
  //       id: z
  //         .string({ required_error: "ID pesan tidak boleh kosong!" })
  //         .min(1, "ID pesan tidak boleh kosong!"),
  //       toUserId: z
  //         .string({ required_error: "ID penerima tidak boleh kosong!" })
  //         .min(1, "ID penerima tidak boleh kosong!"),
  //       message: z
  //         .string({ required_error: "Pesan tidak boleh kosong!" })
  //         .min(1, "Pesan tidak boleh kosong!"),
  //     })
  //     .safeParse({ toUserId, message, id });
  //   if (!validate.success)
  //     return APIResponse.respondWithBadRequest(
  //       validate.error.errors.map((it) => ({
  //         path: it.path[0] as string,
  //         message: it.message,
  //       }))
  //     );

  //   // verifikasi bearer token
  //   const authorization = await verifyBearerToken(request);
  //   if (!authorization) return APIResponse.respondWithUnauthorized();
  //   const { userId } = authorization;

  //   // simpan pesan ke database
  //   const result = await xata.transactions.run([
  //     // simpan pesan ke tabel chat_messages
  //     {
  //       insert: {
  //         table: "chat_messages",
  //         record: {
  //           id,
  //           message,
  //           from: userId,
  //           to: toUserId,
  //           is_deleted: false,
  //         },
  //         createOnly: true,
  //       },
  //     },

  //     // update table chat_rooms untuk orang lain (id: to-from)
  //     {
  //       insert: {
  //         table: "chat_rooms",
  //         record: {
  //           id: `${toUserId}-${userId}`,
  //           last_message: message,
  //           to_user: toUserId,
  //           from_user: userId,
  //           last_sent_user: userId,
  //         },
  //       },
  //     },
  //     // update table chat_rooms untuk user saat ini (id: from-to)
  //     {
  //       insert: {
  //         table: "chat_rooms",
  //         record: {
  //           id: `${userId}-${toUserId}`,
  //           last_message: message,
  //           to_user: userId,
  //           from_user: toUserId,
  //           last_sent_user: userId,
  //         },
  //       },
  //     },
  //   ]);
  //   if (result.results.length !== 3)
  //     return APIResponse.respondWithServerError();

  //   return APIResponse.respondWithSuccess<POSTResponse>({
  //     id: result.results[0].id,
  //   });
  // } catch (e) {
  //   return APIResponse.respondWithServerError();
  // }
}
