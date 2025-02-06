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
      title: string;
      customer: {
        name: string;
      };
    };
  }[];
  jobs: {
    id: string;
    title: string;
    customer: {
      name: string;
    };
  }[];
  offers: [];
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
              "ja.price as bid_price",
              "ja.bid_note",
              "j.id as job_id",
              "j.title as job_title",
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
            .select(["j.id", "j.title", "u2.name as customer_name"])
            .whereRef("j.freelancer", "=", "u.id")
            .where("j.status", "=", "ongoing")
        ).as("jobs"),

        // query untuk mendapatkan daftar offers yang sedang dikerjakan
        // jsonArrayFrom(eb.selectFrom("offers").limit(0)).as("offers"),
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
          title: it.job_title,
          customer: {
            name: it.job_customer_name,
          },
        },
      })),
      jobs: result.jobs.map((it) => ({
        id: it.id,
        title: it.title,
        customer: {
          name: it.customer_name,
        },
      })),
      offers: [],
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
};
