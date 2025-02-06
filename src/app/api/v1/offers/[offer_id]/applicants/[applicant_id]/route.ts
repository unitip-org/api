import { NextRequest } from "next/server";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { verifyBearerToken } from "@/lib/bearer-token";

export async function GET(
  request: NextRequest,
  { params }: { params: { offer_id: string; applicant_id: string } }
) {
  try {
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();

    // Get offer and applicant data
    const applicant = await database
      .selectFrom("offer_applicants as oa")
      .innerJoin("users as u", "u.id", "oa.customer")
      .innerJoin("offers as o", "o.id", "oa.offer")
      .where("oa.id", "=", params.applicant_id)
      .where("oa.offer", "=", params.offer_id as any)
      .select([
        "oa.id",
        "oa.pickup_location",
        "oa.destination_location",
        "oa.note",
        "oa.applicant_status",
        "oa.final_price",
        "oa.pickup_latitude",
        "oa.pickup_longitude", 
        "oa.destination_latitude",
        "oa.destination_longitude",
        "u.id as customer_id",
        "u.name as customer_name",
        "o.freelancer as freelancer_id"
      ])
      .executeTakeFirst();

    if (!applicant) {
      return APIResponse.respondWithNotFound("Applicant tidak ditemukan");
    }

    // Check authorization
    // Hanya driver yang membuat offer dan customer yang apply yang bisa melihat detail
    const canViewDetail = 
      (authorization.role === "driver" && 
       applicant.freelancer_id === authorization.userId as any) ||
      (authorization.role === "customer" && 
       applicant.customer_id === authorization.userId);

    if (!canViewDetail) {
      return APIResponse.respondWithForbidden(
        "Anda tidak memiliki akses untuk melihat detail applicant ini"
      );
    }

    return APIResponse.respondWithSuccess({
      applicant: {
        id: applicant.id,
        customer: {
          id: applicant.customer_id,
          name: applicant.customer_name
        },
        pickup_location: applicant.pickup_location,
        destination_location: applicant.destination_location,
        pickup_coordinates: {
          latitude: applicant.pickup_latitude,
          longitude: applicant.pickup_longitude
        },
        destination_coordinates: {
          latitude: applicant.destination_latitude,
          longitude: applicant.destination_longitude
        },
        note: applicant.note,
        applicant_status: applicant.applicant_status,
        final_price: applicant.final_price
      }
    });

  } catch (e) {
    console.error("GET Error:", e);
    return APIResponse.respondWithServerError();
  }
}
