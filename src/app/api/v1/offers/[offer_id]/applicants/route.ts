import { NextRequest } from "next/server";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { verifyBearerToken } from "@/lib/bearer-token";
import { sql } from "kysely";

interface GETResponse {
  applicants: {
    id: string;
    applicant_status: string;
    note: string;
    pickup_location: string;
    destination_location: string;
    pickup_latitude: number;
    pickup_longitude: number;
    destination_latitude: number;
    destination_longitude: number;
    customer: {
      id: string;
      name: string;
    };
  }[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: { offer_id: string } }
) {
  try {
    const { offer_id } = params;

    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();

    // Cek kepemilikan offer
    const offer = await database
      .selectFrom("offers")
      .select(["id", "freelancer"])
      .where("id", "=", offer_id)
      .executeTakeFirst();

    if (!offer) {
      return APIResponse.respondWithNotFound("Offer tidak ditemukan!");
    }

    if (offer.freelancer as any !== authorization.userId) {
      return APIResponse.respondWithForbidden(
        "Anda tidak memiliki akses untuk melihat data ini!"
      );
    }

    const applicants = await database
      .selectFrom("offer_applicants")
      .innerJoin("users", (join) =>
        join.onRef("users.id", "=", "offer_applicants.customer")
      )
      .select([
        "offer_applicants.id",
        "offer_applicants.applicant_status",
        "offer_applicants.note",
        "offer_applicants.pickup_location",
        "offer_applicants.destination_location",
        "offer_applicants.pickup_latitude",
        "offer_applicants.pickup_longitude",
        "offer_applicants.destination_latitude",
        "offer_applicants.destination_longitude",
        sql<string>`users.id`.as('customer_id'),
        sql<string>`users.name`.as('customer_name'),
      ])
      .where("offer_applicants.offer", "=", offer_id as any)
      .execute();

    const formattedApplicants = applicants.map((applicant) => ({
      id: applicant.id,
      applicant_status: applicant.applicant_status,
      note: applicant.note,
      pickup_location: applicant.pickup_location,
      destination_location: applicant.destination_location,
      pickup_latitude: applicant.pickup_latitude,
      pickup_longitude: applicant.pickup_longitude,
      destination_latitude: applicant.destination_latitude,
      destination_longitude: applicant.destination_longitude,
      customer: {
        id: applicant.customer_id,
        name: applicant.customer_name,
      },
    }));

    return APIResponse.respondWithSuccess<GETResponse>({
      applicants: formattedApplicants,
    });
  } catch (e) {
    console.error(e);
    return APIResponse.respondWithServerError();
  }
}
