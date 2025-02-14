import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { NextRequest } from "next/server";

/**
 * endpoint ini digunakan untuk mendapatkan data dashboard driver
 * seperti daftar jobs yang sudah dilamar, daftar jobs yang sedang
 * dikerjaan, dan lain sebagainya (offers menyusul)
 */
interface GETResponse {
  applications: {
    id: string;
    bid_price: number;
    bid_note: string;
    job: {
      id: string;
      note: string;
      expected_price: number;
      customer: {
        name: string;
      };
    };
  }[];
  jobs: {
    id: string;
    customer: {
      name: string;
    };
  }[];
  offers: {
    id: string;
    title: string;
    price: number;
    description: string;
    pickup_area: string;
    destination_area: string;
    type: string;
    available_until: string;
    max_participants: number;
    applicants: {
      id: string;
      customer_name: string;
      pickup_location: string;
      destination_location: string;
      status: string;
      final_price: number;
    }[];
  }[];
}
export const GET = async (request: NextRequest) => {
  try {
    // verifikasi bearer token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();
    const { userId, role } = authorization;

    // verifikasi role user
    if (role !== "driver")
      return APIResponse.respondWithForbidden(
        "Anda tidak memiliki akses untuk melakukan aksi ini!"
      );

    // query
    const query = database
      .selectFrom("users as u")
      .select((eb) => [
        // query untuk mendapatkan daftar job yang sudah dilamar
        jsonArrayFrom(
          eb
            .selectFrom("job_applications as ja")
            .innerJoin("jobs as j", "j.id", "ja.job")
            .innerJoin("users as u2", "u2.id", "j.customer")
            .select([
              "ja.id",
              "ja.bid_price",
              "ja.bid_note",
              "j.id as job_id",
              "j.note as job_note",
              "j.expected_price as job_expected_price",
              "u2.name as job_customer_name",
            ])
            .whereRef("ja.freelancer", "=", "u.id")
            .where("j.status", "=", "")
        ).as("applications"),

        // query untuk mendapatkan daftar job yang sedang dikerjakan
        jsonArrayFrom(
          eb
            .selectFrom("jobs as j")
            .innerJoin("users as u2", "u2.id", "j.customer")
            .select(["j.id", "u2.name as customer_name"])
            .whereRef("j.freelancer", "=", "u.id")
            .where("j.status", "=", "ongoing")
        ).as("jobs"),

         // query untuk mendapatkan daftar offers yang aktif
         jsonArrayFrom(
          eb
            .selectFrom("offers as o")
            .leftJoin("offer_applicants as oa", "oa.offer", "o.id")
            .leftJoin("users as u2", "u2.id", "oa.customer")
            .select([
              "o.id",
              "o.title",
              "o.price",
              "o.description",
              "o.pickup_area",
              "o.destination_area", 
              "o.type",
              "o.available_until",
              "o.max_participants",
              jsonArrayFrom(
                eb
                  .selectFrom("offer_applicants as oa2")
                  .innerJoin("users as u3", "u3.id", "oa2.customer")
                  .select([
                    "oa2.id",
                    "u3.name as customer_name",
                    "oa2.pickup_location",
                    "oa2.destination_location",
                    "oa2.applicant_status as status",
                    "oa2.final_price"
                  ])
                  .whereRef("oa2.offer", "=", "o.id" as any)
              ).as("applicants")
            ])
            .where("o.freelancer", "=", userId as any)
            .where("o.offer_status", "=", "available")
            .groupBy([
              "o.id",
              "o.title",
              "o.price",
              "o.description",
              "o.pickup_area",
              "o.destination_area",
              "o.type", 
              "o.available_until",
              "o.max_participants"
            ])
        ).as("offers"),
      ])
      .where("u.id", "=", userId);

    const result = await query.executeTakeFirstOrThrow();

    return APIResponse.respondWithSuccess<GETResponse>({
      applications: result.applications.map((it) => ({
        id: it.id,
        bid_price: it.bid_price,
        bid_note: it.bid_note,
        job: {
          id: it.job_id,
          note: it.job_note,
          expected_price: it.job_expected_price,
          customer: {
            name: it.job_customer_name,
          },
        },
      })),
      jobs: result.jobs.map((it) => ({
        id: it.id,
        customer: {
          name: it.customer_name,
        },
      })),
      offers: result.offers.map((it) => ({
        id: it.id,
        title: it.title,
        price: it.price,
        description: it.description,
        pickup_area: it.pickup_area,
        destination_area: it.destination_area,
        type: it.type,
        available_until: new Date(it.available_until).toISOString(),
        max_participants: it.max_participants,
        applicants: it.applicants.map((app) => ({
          id: app.id,
          customer_name: app.customer_name,
          pickup_location: app.pickup_location,
          destination_location: app.destination_location,
          status: app.status,
          final_price: app.final_price
        }))
      })),
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
};
