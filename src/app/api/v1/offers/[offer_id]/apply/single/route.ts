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
      const { note, delivery_location, pickup_location } = json;
      const { offer_id } = params;
  
      const schema = z.object({
        note: z.string({
          required_error: "Catatan untuk pemesanan tidak boleh kosong!",
        }).min(5, "Catatan pemesanan minimal 5 karakter!"),
        delivery_location: z.string({
          required_error: "Tempat pengiriman pesanan tidak boleh kosong!",
        }).min(5, "Tempat pengiriman minimal 5 karakter!"),
        pickup_location: z.string({
          required_error: "Lokasi penjemputan tidak boleh kosong!",
        }).min(5, "Lokasi penjemputan minimal 5 karakter!"),
        offer_id: z.string().min(1, "Offer ID tidak boleh kosong!"),
      });
  
      const data = schema.safeParse({ 
        note, 
        delivery_location,
        pickup_location,
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
  
      if (authorization.role !== "customer") {
        return APIResponse.respondWithForbidden(
          "Anda tidak memiliki akses untuk melakukan aksi ini!"
        );
      }
  
      const singleOffer = await database
        .selectFrom("single_offers")
        .select(["id", "offer_status"])
        .where("id", "=", offer_id)
        .where("offer_status", "=", "waiting")
        .where("available_until", ">", sql<Date>`NOW()`)
        .executeTakeFirst();
  
      if (!singleOffer) {
        return APIResponse.respondWithConflict(
          "Offer tidak tersedia atau sudah berakhir!"
        );
      }
  
      const existingApplication = await database
        .selectFrom("single_offer_applicants")
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
        .insertInto("single_offer_applicants")
        .values({
          id: `${authorization.userId}_${offer_id}`,
          note,
          pickup_location,
          delivery_location,
          customer: authorization.userId,
          offer: offer_id,
        } as any)
        .returning("id")
        .executeTakeFirst();
  
      if (!result) return APIResponse.respondWithServerError();
  
      await database
        .updateTable("single_offers")
        .set({ 
          offer_status: "on_progress",
          customer: authorization.userId as any
        })
        .where("id", "=", offer_id)
        .execute();
  
      return APIResponse.respondWithSuccess<POSTResponse>({
        success: true,
        id: result.id,
      });
  
    } catch (e) {
      console.error(e);
      return APIResponse.respondWithServerError();
    }
  }