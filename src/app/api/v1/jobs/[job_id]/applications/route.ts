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

interface POSTBody {
  price: number;
  bid_note: string;
}
interface POSTResponse {
  id: string;
}
export const POST = async (request: NextRequest, { params }: Params) => {
  try {
    // verifikasi request user
    const { job_id: jobId } = params;
    const { price, bid_note: bidNote }: POSTBody = await request.json();
    const validate = z
      .object({
        jobId: z
          .string({ required_error: "ID pekerjaan tidak boleh kosong!" })
          .min(1, "ID pekerjaan tidak boleh kosong!"),
        price: z
          .number({ required_error: "Harga tidak boleh kosong!" })
          .min(0, "Harga tidak boleh kurang dari 0!"),
        bidNote: z.string().optional(),
      })
      .safeParse({ jobId, price, bidNote });
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
    const { userId, role } = authorization;

    // verifikasi role user
    if (role !== "driver")
      return APIResponse.respondWithForbidden(
        "Anda tidak memiliki akses untuk melakukan aksi ini!"
      );

    /**
     * ambil job berdasarkan id serta cari job yang belum diambil
     * oleh driver manapun untuk melakukan validasi harga penawaran
     * agar sesuai dengan harga standar
     */
    const jobQuery = database
      .selectFrom("jobs as j")
      .select(["j.expected_price"])
      .where("j.id", "=", jobId)
      .where("j.freelancer", "is", null);
    const jobResult = await jobQuery.executeTakeFirstOrThrow();

    /**
     * validasi jika harga penawaran kurang dari harga standar
     * maka perlu memberikan pesan error
     */
    if (price < jobResult.expected_price)
      return APIResponse.respondWithForbidden(
        "Harga penawaran tidak boleh kurang dari harga standar!"
      );

    /**
     * jika harga penawaran tidak sama dengan harga standar
     * maka perlu memberikan alasan penawaran sehingga
     * perlu validasi bidNote agar tidak kosong
     */
    if (price !== jobResult.expected_price) {
      const validate2 = z
        .object({
          bidNote: z
            .string({ required_error: "Alasan penawaran tidak boleh kosong!" })
            .min(1, "Alasan penawaran tidak boleh kosong!"),
        })
        .safeParse({ bidNote });
      if (!validate2.success)
        return APIResponse.respondWithBadRequest(
          validate2.error.errors.map((it) => ({
            path: it.path[0] as string,
            message: it.message,
          }))
        );
    }

    // apply job
    const query = database
      .insertInto("job_applications")
      .values({
        price,
        bid_note: bidNote,
        freelancer: userId,
        job: jobId,
      } as any)
      .returning("id");
    const result = await query.executeTakeFirstOrThrow();

    return APIResponse.respondWithSuccess<POSTResponse>({
      id: result.id,
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
};

interface GETResponse {
  applications: {
    id: string;
    price: number;
    bid_note: string;
    created_at: string;
    updated_at: string;
    driver_name: string;
  }[];
}
export const GET = async (request: NextRequest, { params }: Params) => {
  try {
    // verifikasi request user
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

    // mendapatkan daftar applications
    const query = database
      .selectFrom("job_applications as ja")
      .innerJoin("users as u", "u.id", "ja.freelancer")
      .select([
        "ja.id",
        "ja.price",
        "ja.bid_note",
        sql<string>`ja."xata.createdAt"`.as("created_at"),
        sql<string>`ja."xata.updatedAt"`.as("updated_at"),
        "u.name as driver_name",
      ])
      .where("ja.id", "=", jobId)
      .orderBy("ja.price asc");
    const result = await query.execute();

    return APIResponse.respondWithSuccess<GETResponse>({
      applications: result.map((it) => ({
        id: it.id,
        price: it.price,
        bid_note: it.bid_note,
        created_at: convertDatetimeToISO(it.created_at),
        updated_at: convertDatetimeToISO(it.updated_at),
        driver_name: it.driver_name,
      })),
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
};

interface PATCHResponse {
  id: string;
}
export const PATCH = async (request: NextRequest, { params }: Params) => {
  try {
    // verifikasi request user
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
    const { userId, role } = authorization;

    // verifikasi role user
    if (role !== "driver")
      return APIResponse.respondWithForbidden(
        "Anda tidak memiliki akses untuk melakukan aksi ini!"
      );

    // apply job
    const query = database
      .updateTable("jobs")
      .set({
        freelancer: userId as any,
        status: "ongoing",
      })
      .where("id", "=", jobId)
      .where("freelancer", "is", null)
      .returning("id");
    const result = await query.executeTakeFirst();

    if (!result)
      return APIResponse.respondWithConflict(
        "Pekerjaan ini sudah diambil oleh driver lain!"
      );

    return APIResponse.respondWithSuccess<PATCHResponse>({
      id: result.id,
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
};

interface DELETEResponse {
  id: string;
}
export const DELETE = async (request: NextRequest, { params }: Params) => {
  try {
    // verifikasi request user
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
    const { userId, role } = authorization;

    // verifikasi role user
    if (role !== "driver")
      return APIResponse.respondWithForbidden(
        "Anda tidak memiliki akses untuk melakukan aksi ini!"
      );

    // cancel job
    const query = database
      .updateTable("jobs")
      .set({
        freelancer: null as any,
        status: "",
      })
      .where("id", "=", jobId)
      .where("freelancer", "=", userId as any)
      .returning("id");
    const result = await query.executeTakeFirstOrThrow();

    return APIResponse.respondWithSuccess<DELETEResponse>({
      id: result.id,
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
};
