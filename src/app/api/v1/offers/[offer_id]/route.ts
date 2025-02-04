import { NextRequest } from "next/server";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { verifyBearerToken } from "@/lib/bearer-token";
import { sql } from "kysely";

export async function GET(
  request: NextRequest,
  { params }: { params: { offer_id: string } }
) {
  ``;
  try {
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();

    const offer = await database
      .selectFrom("offers as so")
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

    const applicantsCount = await database
      .selectFrom("offer_applicants")
      .where("offer", "=", params.offer_id as any)
      .select(sql`count(*)`.as("count"))
      .executeTakeFirst();

    const hasApplied = await database
      .selectFrom("offer_applicants")
      .where("offer", "=", params.offer_id as any)
      .where("customer", "=", authorization.userId as any)
      .select("id")
      .executeTakeFirst();

    // console.log("Offer:", offer);
    // console.log("Applicants count:", applicantsCount);
    // console.log("Has applied:", !!hasApplied);
    // console.log("Authorization:", authorization.userId);

    return APIResponse.respondWithSuccess({
      offer: {
        ...offer,
        freelancer: {
          name: offer.freelancer_name,
        },
        applicants_count: applicantsCount?.count || 0,
        has_applied: !!hasApplied,
      },
    });
  } catch (e) {
    console.error("GET Error:", e);
    return APIResponse.respondWithServerError();
  }
}
