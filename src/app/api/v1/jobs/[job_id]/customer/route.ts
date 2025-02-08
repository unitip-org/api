import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { jsonArrayFrom } from "kysely/helpers/postgres";
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
  note: string;
  status: string;
  applications: {
    id: string;
    bid_price: number;
    bid_note: string;
    driver: {
      name: string;
    };
  }[];
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
    const { role, userId } = authorization;

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
        "j.title",
        "j.note",
        "j.status",
        jsonArrayFrom(
          eb
            .selectFrom("job_applications as ja")
            .innerJoin("users as u", "u.id", "ja.freelancer")
            .select([
              "ja.id",
              "ja.price as bid_price",
              "ja.bid_note",
              "u.name as driver_name",
            ])
            .whereRef("ja.job", "=", "j.id")
        ).as("applicatins"),
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
      note: result.note,
      status: result.status,
      applications: result.applicatins.map((it) => ({
        id: it.id,
        bid_price: it.bid_price,
        bid_note: it.bid_note,
        driver: {
          name: it.driver_name,
        },
      })),
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
};
