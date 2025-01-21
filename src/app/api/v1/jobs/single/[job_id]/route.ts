import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { sql } from "kysely";
import { NextRequest } from "next/server";
import { z } from "zod";

interface GETResponse {
  id: string;
  title: string;
  destination: string;
  note: string;
  type: string;
  pickup_location: string;
  created_at: string;
  updated_at: string;
  applicants: {
    id: string;
    name: string;
    price: number;
  }[];
}

interface POSTResponse {
  success: boolean;
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { job_id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");

    // validasi input dari user
    const data = z
      .object({
        job_id: z
          .string({ required_error: "Job ID tidak boleh kosong!" })
          .min(1, "Job ID tidak boleh kosong!"),
        type: z.enum(["antar-jemput", "jasa-titip"], {
          required_error: "Type tidak boleh kosong!",
        }),
      })
      .safeParse({ job_id: params.job_id, type });
    if (!data.success)
      return APIResponse.respondWithBadRequest(
        data.error.errors.map((it) => ({
          message: it.message,
          path: it.path[0] as string,
        }))
      );

    // verifikasi authentication token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();

    // query ke database
    if (type === "antar-jemput") {
      // query ke table single_jobs
      const query = database
        .selectFrom("single_jobs as j")
        .select([
          "j.id",
          "j.title",
          "j.destination",
          "j.note",
          "j.service",
          "j.pickup_location",
        ])
        .select(sql<string>`j."xata.createdAt"`.as("created_at"))
        .select(sql<string>`j."xata.updatedAt"`.as("updated_at"))
        .where("j.id", "=", params.job_id)
        .where("j.service", "=", type);
      const result = await query.executeTakeFirst();

      // check apakah job ditemukan
      if (!result)
        return APIResponse.respondWithNotFound("Job tidak ditemukan!");

      // query untuk mendapatkan applicants
      const applicantsQuery = database
        .selectFrom("single_job_applicants as a")
        .innerJoin("users as u", "u.id", "a.freelancer")
        .select(["a.id", "u.name", "a.price"])
        .where("a.job", "=", result.id as any);
      const applicantsResult = await applicantsQuery.execute();

      return APIResponse.respondWithSuccess<GETResponse>({
        id: result.id,
        title: result.title,
        destination: result.destination,
        note: result.note,
        type: result.service,
        pickup_location: result.pickup_location,
        created_at: result.created_at,
        updated_at: result.updated_at,
        applicants: applicantsResult,
      });
    } else if (type === "jasa-titip") {
      // query ke table delivery_jobs
    }

    return APIResponse.respondWithServerError();
  } catch (e) {
    return APIResponse.respondWithServerError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const { title, destination, note, type, pickup_location } = json;

    // validasi input dari user
    const data = z
      .object({
        title: z
          .string({ required_error: "Judul tidak boleh kosong!" })
          .min(1, "Judul tidak boleh kosong!"),
        destination: z
          .string({ required_error: "Lokasi tujuan tidak boleh kosong!" })
          .min(1, "Lokasi tujuan tidak boleh kosong!"),
        note: z.string().optional(),
        type: z.enum(["antar-jemput", "jasa-titip"]),
        pickup_location: z
          .string({ required_error: "Lokasi jemput tidak boleh kosong!" })
          .min(1, "Lokasi jemput tidak boleh kosong!"),
      })
      .safeParse({ title, destination, note, type, pickup_location });
    if (!data.success)
      return APIResponse.respondWithBadRequest(
        data.error.errors.map((it) => ({
          message: it.message,
          path: it.path[0] as string,
        }))
      );

    // validasi auth token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();

    // validasi role
    if (authorization.role !== "customer")
      return APIResponse.respondWithForbidden(
        "Anda tidak memiliki akses untuk membuat job!"
      );

    // validasi type
    if (type === "antar-jemput") {
      /**
       * antar jemput adalah service single job dan hanya dapat dibuat oleh role
       * customer
       */

      const query = database
        .insertInto("single_jobs")
        .values({
          title,
          destination,
          note,
          type,
          pickup_location,
          customer: authorization.userId,
        } as any)
        .returning("id");
      const result = await query.executeTakeFirst();

      // validasi jika gagal insert record
      if (!result) return APIResponse.respondWithServerError();

      // berhasil insert record
      return APIResponse.respondWithSuccess<POSTResponse>({
        id: result.id,
        success: true,
      });
    } else if (type === "jasa-titip") {
      /**
       * jasa titip adalah service multiple job dan hanya dapat dibuat oleh role
       * customer
       */
    }

    return APIResponse.respondWithServerError();
  } catch (e) {
    return APIResponse.respondWithServerError();
  }
}
