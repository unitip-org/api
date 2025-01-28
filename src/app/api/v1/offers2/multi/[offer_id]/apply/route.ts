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
    const { note, delivery_location, payment_method } = json;
    const { offer_id } = params;

    const schema = z.object({
      note: z.string({
        required_error: "Catatan untuk pemesanan tidak boleh kosong!",
      }).min(5, "Catatan pemesanan minimal 5 karakter!"),
      delivery_location: z.string({
        required_error: "Tempat pengiriman pesanan tidak boleh kosong!",
      }).min(5, "Tempat pengiriman minimal 5 karakter!"),
      payment_method: z.string({
        required_error: "Metode pembayaran tidak boleh kosong!",
      }),
      offer_id: z.string().min(1, "Offer ID tidak boleh kosong!"),
    });

    const data = schema.safeParse({ 
      note, 
      delivery_location, 
      payment_method, 
      offer_id 
    });

    if (!data.success) {
      return APIResponse.respondWithBadRequest(
        data.error.errors.map((it) => ({
          message: it.message,
          path: it.path[0] as string,
        }))
      );
    }

    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();

    if (authorization.role !== "driver") {
      return APIResponse.respondWithForbidden(
        "Anda tidak memiliki akses untuk melakukan aksi ini!"
      );
    }

    const multiOffer = await database
      .selectFrom("multi_offers")
      .select(["id", "status"])
      .where("id", "=", offer_id)
      .where("available_until", ">", sql<Date>`NOW()`)
      .executeTakeFirst();

    if (!multiOffer || multiOffer.status !== "available") {
      return APIResponse.respondWithConflict(
        "Offer tidak tersedia atau sudah berakhir!"
      );
    }

    const existingApplication = await database
      .selectFrom("multi_offer_followers")
      .select("id")
      .where("customer", "=", authorization.userId as any)
      .where("offer", "=", offer_id as any)
      .executeTakeFirst();

    if (existingApplication) {
      return APIResponse.respondWithConflict(
        "Anda sudah mengajukan aplikasi untuk offer ini!"
      );
    }

    const result = await database
      .insertInto("multi_offer_followers")
      .values({
        id: `${authorization.userId}_${offer_id}`,
        note,
        delivery_location,
        payment_method,
        payment_status: "unpaid",
        status: "pending",
        customer: authorization.userId,
        offer: offer_id,
      } as any)
      .returning("id")
      .executeTakeFirst();

    if (!result) return APIResponse.respondWithServerError();

    return APIResponse.respondWithSuccess<POSTResponse>({
      success: true,
      id: result.id,
    });

  } catch (e) {
    console.error(e);
    return APIResponse.respondWithServerError();
  }
}
