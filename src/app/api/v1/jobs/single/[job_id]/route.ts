import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { sql } from "kysely";
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
  destination: string;
  note: string;
  service: string;
  pickup_location: string;
  created_at: string;
  updated_at: string;
  customer_id: string;
  applications: {
    id: string;
    freelancer_name: string;
    price: number;
  }[];
}
export const GET = async (request: NextRequest, { params }: Params) => {
  try {
    // mendapatkan input dari user
    const { job_id: jobId } = params;
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");

    // validasi input dari user
    const data = z
      .object({
        jobId: z
          .string({ required_error: "ID pekerjaan tidak boleh kosong!" })
          .min(1, "ID pekerjaan tidak boleh kosong!"),
        type: z.enum(["single", "multi"], {
          required_error: "Type tidak boleh kosong!",
        }),
      })
      .safeParse({ jobId, type });
    if (!data.success)
      return APIResponse.respondWithBadRequest(
        data.error.errors.map((it) => ({
          path: it.path[0] as string,
          message: it.message,
        }))
      );

    // verifikasi authentication token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();

    // query ke database
    if (type === "single") {
      // query ke table single_jobs
      const query = database
        .selectFrom("single_jobs as sj")
        .select((eb) => [
          "sj.id",
          "sj.title",
          "sj.destination",
          "sj.note",
          "sj.service",
          "sj.pickup_location",
          "sj.customer as customer_id",
          sql<string>`sj."xata.createdAt"`.as("created_at"),
          sql<string>`sj."xata.updatedAt"`.as("updated_at"),
          jsonArrayFrom(
            eb
              .selectFrom("single_job_applicants as sja")
              .innerJoin("users as u", "u.id", "sja.freelancer")
              .select(["sja.id", "u.name as freelancer_name", "sja.price"])
              .whereRef("sja.job", "=", "sj.id")
          ).as("applications"),
        ])
        .where("sj.id", "=", params.job_id);
      const result = await query.executeTakeFirst();

      if (!result)
        return APIResponse.respondWithNotFound(
          "Pekerjaan dengan ID tersebut tidak ditemukan!"
        );

      return APIResponse.respondWithSuccess<GETResponse>({
        id: result.id,
        title: result.title,
        destination: result.destination,
        note: result.note,
        service: result.service,
        pickup_location: result.pickup_location,
        created_at: result.created_at,
        updated_at: result.updated_at,
        customer_id: result.customer_id as any,
        applications: result.applications,
      });
    } else if (type === "multi") {
      // query ke table multi_jobs
    }

    return APIResponse.respondWithServerError();
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
};

interface PATCHBody {
  title: string;
  destination: string;
  note: string;
  pickup_location: string;
}
interface PATCHResponse {
  id: string;
}
export const PATCH = async (request: NextRequest, { params }: Params) => {
  try {
    // verifikasi request dari user
    const {
      title,
      destination,
      note,
      pickup_location: pickupLocation,
    }: PATCHBody = await request.json();
    const { job_id: jobId } = params;

    const validate = z
      .object({
        title: z
          .string({ required_error: "Judul pekerjaan tidak boleh kosong!" })
          .min(1, "Judul pekerjaan tidak boleh kosong!"),
        destination: z
          .string({ required_error: "Tujuan pekerjaan tidak boleh kosong!" })
          .min(1, "Tujuan pekerjaan tidak boleh kosong!"),
        note: z.string().optional(),
        pickupLocation: z
          .string({ required_error: "Lokasi penjemputan tidak boleh kosong!" })
          .min(1, "Lokasi penjemputan tidak boleh kosong!"),
        jobId: z
          .string({ required_error: "ID pekerjaan tidak boleh kosong!" })
          .min(1, "ID pekerjaan tidak boleh kosong!"),
      })
      .safeParse({ title, destination, note, pickupLocation, jobId });
    if (!validate.success)
      return APIResponse.respondWithBadRequest(
        validate.error.errors.map((it) => ({
          path: it.path[0] as string,
          message: it.message,
        }))
      );

    // verifikasi authentication token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();
    const { userId, role } = authorization;

    // verifikasi role
    if (role !== "customer")
      return APIResponse.respondWithForbidden(
        "Anda tidak memiliki akses untuk mengubah pekerjaan ini!"
      );

    // update job di database
    const query = database
      .updateTable("single_jobs")
      .set({
        title,
        destination,
        note,
        pickup_location: pickupLocation,
      })
      .where("id", "=", jobId)
      .where("customer", "=", userId as any)
      .returning(["id"]);
    const result = await query.executeTakeFirstOrThrow();

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

    // verifikasi authentication token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();
    const { userId, role } = authorization;

    // verifikasi role
    if (role !== "customer")
      return APIResponse.respondWithForbidden(
        "Anda tidak memiliki akses untuk menghapus pekerjaan ini!"
      );

    // menghapus job dari database
    const query = database
      .deleteFrom("single_jobs")
      .where("id", "=", jobId)
      .where("customer", "=", userId as any)
      .returning(["id"]);
    const result = await query.executeTakeFirstOrThrow();

    return APIResponse.respondWithSuccess<DELETEResponse>({
      id: result.id,
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
};
