import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { NextRequest } from "next/server";
import { z } from "zod";

interface Params {
  params: {
    job_id: string;
  };
}

interface GETResponse {
  id: string;
  note: string;
  pickup_location: string;
  destination_location: string;
  expected_price: number;
  price: number;
  service: string;
  status: string;
  applications: {
    id: string;
    bid_price: number;
    bid_note: string;
    driver: {
      name: string;
    };
  }[];
  driver?: {
    id: string;
    name: string;
  };
}
export const GET = async (request: NextRequest, { params }: Params) => {
  try {
    // verifikasi request dari user
    const { job_id: jobId } = params;
    const validate = z
      .object({
        jobId: z
          .string({ required_error: "ID pekerjaan tidak boleh kosong!" })
          .min(1, "ID pekerjaan tidak boleh kosong!"),
      })
      .safeParse({ jobId });
    if (!validate.success)
      return APIResponse.respondWithBadRequest(
        validate.error.errors.map((it) => ({
          path: it.path[0] as string,
          message: it.message,
        }))
      );

    // verifikasi bearer token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();
    const { role } = authorization;

    // verifikasi role user
    if (role !== "customer")
      return APIResponse.respondWithForbidden(
        "Anda tidak memiliki akses untuk melakukan tindakan ini!"
      );

    // query ke database
    const query = database
      .selectFrom("jobs as j")
      .select((eb) => [
        "j.id",
        "j.note",
        "j.pickup_location",
        "j.destination_location",
        "j.expected_price",
        "j.price",
        "j.service",
        "j.status",
        jsonArrayFrom(
          eb
            .selectFrom("job_applications as ja")
            .innerJoin("users as u", "u.id", "ja.freelancer")
            .select([
              "ja.id",
              "ja.bid_price",
              "ja.bid_note",
              "u.name as driver_name",
            ])
            .whereRef("ja.job", "=", "j.id")
        ).as("applications"),
        jsonObjectFrom(
          eb
            .selectFrom("users as u")
            .select(["u.id", "u.name"])
            .whereRef("u.id", "=", "j.freelancer")
        ).as("driver"),
      ])
      .where("j.id", "=", jobId);
    const result = await query.executeTakeFirst();

    if (!result)
      return APIResponse.respondWithNotFound(
        "Pekerjaan dengan ID tersebut tidak ditemukan!"
      );

    return APIResponse.respondWithSuccess<GETResponse>({
      id: result.id,
      note: result.note,
      pickup_location: result.pickup_location,
      destination_location: result.destination_location,
      expected_price: result.expected_price,
      price: result.price,
      service: result.service,
      status: result.status,
      applications: result.applications.map((it) => ({
        id: it.id,
        bid_price: it.bid_price,
        bid_note: it.bid_note,
        driver: {
          name: it.driver_name,
        },
      })),
      driver: result.driver || undefined,
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
};
