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
interface GETResponse {}
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
            .select(["j.id", "j.title"])
            .whereRef("ja.freelancer", "=", "u.id")
            .where("j.status", "=", "")
        ).as("applications"),

        // query untuk mendapatkan daftar job yang sedang dikerjakan
        jsonArrayFrom(
          eb
            .selectFrom("jobs as j")
            .select(["j.id", "j.title", "j.status"])
            .whereRef("j.freelancer", "=", "u.id")
            .where("j.status", "=", "ongoing")
        ).as("jobs"),

        // query untuk mendapatkan daftar offers yang sedang dikerjakan
        jsonArrayFrom(eb.selectFrom("offers").limit(0)).as("offers"),
      ])
      .where("u.id", "=", userId);
    const result = await query.executeTakeFirstOrThrow();

    return APIResponse.respondWithSuccess(result);
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
};
