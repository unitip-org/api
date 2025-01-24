import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { sql } from "kysely";
import { NextRequest } from "next/server";
import { z } from "zod";

interface POSTResponse {
  success: boolean;
  id: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { offer_id: string } }
) {
  try {
    const json = await request.json();
    const { note } = json;
    const { delivery } = json;
    const { offer_id } = params;

    const data = z
      .object({
        note: z
          .string({
            required_error: "Catatan untuk pemesanan tidak boleh kosong!",
          })
          .min(5, "Catatan pemesanan minimal 5 karakter!"),
        delivery: z
          .string({
            required_error: "Tempat pengiriman pesanan tidak boleh kosong!",
          })
          .min(5, "Tempat pengiriman minimal 5 karakter!"),
        offer_id: z
          .string({ required_error: "Offer ID tidak boleh kosong!" })
          .min(1, "Offer ID tidak boleh kosong!"),
      })
      .safeParse({ note, delivery, offer_id });
    if (!data.success)
      return APIResponse.respondWithBadRequest(
        data.error.errors.map((it) => ({
          message: it.message,
          path: it.path[0] as string,
        }))
      );
    // validasi token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();

    if (authorization.role !== "customer")
      return APIResponse.respondWithForbidden(
        "Anda tidak memiliki akses untuk melakukan aksi ini!"
      );

    //Karena single offer jadi mau validasi jika udah ada yang ambil
    const checkApplyQuery = database
      .selectFrom("single_offers as so")
      .select(sql<number>`count(so.id)`.as("count"))
      .where("so.id", "=", offer_id)
      .where("so.customer", "is", null);
    const checkApplyResult = await checkApplyQuery.executeTakeFirst();

    if (!checkApplyResult) return APIResponse.respondWithServerError();

    if (checkApplyResult.count === 0)
      return APIResponse.respondWithConflict(
        "Offer sudah diambil oleh orang lain!"
      );

    //Logika apply job
    const newId = `${authorization.userId}_${offer_id}`;
    const query = database
      .insertInto("single_offer_applicants")
      .values({
        id: newId,
        note,
        delivery,
        customer: authorization.userId,
        offer: offer_id,
      } as any)
      .returning("id");
    const result = await query.executeTakeFirst();

    // validasi insert record
    if (!result) return APIResponse.respondWithServerError();

    return APIResponse.respondWithSuccess<POSTResponse>({
      success: true,
      id: result.id,
    });
  } catch (e) {
    return APIResponse.respondWithServerError();
  }
}
