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
      .selectFrom("offers as o")
      .innerJoin("users as u", "u.id", "o.freelancer")
      .select([
        "o.id",
        "o.title",
        "o.description",
        "o.type",
        "o.available_until",
        "o.price",
        "o.destination_area",
        "o.pickup_area",
        "o.offer_status",
        "o.max_participants",
        "u.id as freelancer_id",
        "u.name as freelancer_name",
        sql<string>`o."xata.createdAt"`.as("created_at"),
        sql<string>`o."xata.updatedAt"`.as("updated_at"),
      ])
      .where("o.id", "=", params.offer_id)
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

    const applicants = await database
      .selectFrom("offer_applicants as oa")
      .innerJoin("users as u", "u.id", "oa.customer")
      .where("oa.offer", "=", params.offer_id as any)
      .select([
        "oa.id",
        "oa.pickup_location",
        "oa.destination_location",
        "oa.note",
        "oa.applicant_status",
        "oa.final_price",
        "u.id as customer_id",
        "u.name as customer_name",
      ])
      .execute();

    // Check if the user can view applicants,
    // Hanya driver yang membuat post dan customer yang apply yang bisa melihat applicants
    const canViewApplicants =
      (authorization.role === "driver" &&
        offer.freelancer_id === authorization.userId) ||
      (authorization.role === "customer" &&
        applicants.some((a) => a.customer_id === authorization.userId));

    // console freelancer id
    console.log("freelancer id", offer.freelancer_id);

    return APIResponse.respondWithSuccess({
      offer: {
        ...offer,
        freelancer: {
          id: offer.freelancer_id,
          name: offer.freelancer_name,
        },
        applicants_count: applicantsCount?.count || 0,
        has_applied: !!hasApplied,
        applicants: canViewApplicants ? applicants : [],
      },
    });
  } catch (e) {
    console.error("GET Error:", e);
    return APIResponse.respondWithServerError();
  }
}
