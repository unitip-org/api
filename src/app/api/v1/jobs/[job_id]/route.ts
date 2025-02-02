import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { convertDatetimeToISO } from "@/lib/utils";
import { sql } from "kysely";
import { NextRequest } from "next/server";
import { z } from "zod";

interface Params {
  params: {
    job_id: string;
  };
}

interface GETResponse {
  id: string;
  title: string;
  destination_location: string;
  destination_latitude?: number;
  destination_longitude?: number;
  note: string;
  service: string;
  pickup_location: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  created_at: string;
  updated_at: string;
  customer: {
    id: string;
    name: string;
  };
}
export const GET = async (request: NextRequest, { params }: Params) => {
  try {
    // validasi request dari user
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

    // verifikasi token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();

    // mendapatkan data job
    const query = database
      .selectFrom("jobs as j")
      .innerJoin("users as u", "u.id", "j.customer")
      .select([
        "j.id",
        "j.title",
        "j.destination_location",
        "j.destination_latitude",
        "j.destination_longitude",
        "j.note",
        "j.service",
        "j.pickup_location",
        "j.pickup_latitude",
        "j.pickup_longitude",
        sql<string>`j."xata.createdAt"`.as("created_at"),
        sql<string>`j."xata.updatedAt"`.as("updated_at"),
        "u.id as customer_id",
        "u.name as customer_name",
      ])
      .where("j.id", "=", jobId);
    const result = await query.executeTakeFirst();

    if (!result)
      return APIResponse.respondWithNotFound(
        "Pekerjaan dengan ID tersebut tidak ditemukan!"
      );

    return APIResponse.respondWithSuccess<GETResponse>({
      id: result.id,
      title: result.title,
      destination_location: result.destination_location,
      destination_latitude: result.destination_latitude,
      destination_longitude: result.destination_longitude,
      note: result.note,
      service: result.service,
      pickup_location: result.pickup_location,
      pickup_latitude: result.pickup_latitude,
      pickup_longitude: result.pickup_longitude,
      created_at: convertDatetimeToISO(result.created_at),
      updated_at: convertDatetimeToISO(result.updated_at),
      customer: {
        id: result.customer_id,
        name: result.customer_name,
      },
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
};
