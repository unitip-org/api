import { NextRequest } from "next/server";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { verifyBearerToken } from "@/lib/bearer-token";
import { sql } from "kysely";

export async function GET(
    request: NextRequest,
    { params }: { params: { offer_id: string } }
  ) {
    try {
      const authorization = await verifyBearerToken(request);
      if (!authorization) return APIResponse.respondWithUnauthorized();
  
      const offer = await database
        .selectFrom("single_offers as so")
        .innerJoin("users as u", "u.id", "so.freelancer")
        .select([
          "so.id",
          "so.title",
          "so.description",
          "so.type",
          "so.available_until",
          "so.price",
          "so.destination_area",
          "so.pickup_area",
          "so.offer_status",
          "so.max_participants",
          "u.name as freelancer_name",
          sql<string>`so."xata.createdAt"`.as("created_at"),
          sql<string>`so."xata.updatedAt"`.as("updated_at"),
        ])
        .where("so.id", "=", params.offer_id)
        .executeTakeFirst();
  
      if (!offer) {
        return APIResponse.respondWithNotFound("Offer tidak ditemukan");
      }
  
      return APIResponse.respondWithSuccess({
        offer: {
          ...offer,
          freelancer: {
            name: offer.freelancer_name,
          },
        },
      });
    } catch (e) {
      console.error("GET Error:", e);
      return APIResponse.respondWithServerError();
    }
  }