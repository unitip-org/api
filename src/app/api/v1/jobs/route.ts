import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { sql } from "kysely";
import { NextRequest } from "next/server";
import { z } from "zod";

interface POSTResponse {
  success: boolean;
  id: string;
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

interface JobCustomer {
  name: string;
}
interface Job {
  id: string;
  title: string;
  destination: string;
  note: string;
  type: string;
  pickup_location: string;
  created_at: string;
  updated_at: string;
  customer: JobCustomer;
}

interface GETResponse {
  jobs: Job[];
  page_info: {
    count: number;
    page: number;
    total_pages: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    // validasi auth token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();

    // mendapatkan page and limit
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "10");

    const jobsQuery = database
      .selectFrom("single_jobs as sj")
      .innerJoin("users as u", "u.id", "sj.customer")
      .select([
        "sj.id",
        "sj.title",
        "sj.destination",
        "sj.note",
        "sj.type",
        "sj.pickup_location",
        "u.name as customer_name",
      ])
      .select(sql<string>`sj."xata.createdAt"`.as("created_at"))
      .select(sql<string>`sj."xata.updatedAt"`.as("updated_at"))
      .offset((page - 1) * limit)
      .orderBy("created_at", "desc")
      .limit(limit);
    const jobsResult = await jobsQuery.execute();

    // mendapatkan total row dari table single jobs
    const queryCount = database
      .selectFrom("single_jobs as sj")
      .select(sql<number>`count(sj.id)`.as("count"));
    const resultCount = await queryCount.executeTakeFirst();

    return APIResponse.respondWithSuccess<GETResponse>({
      jobs: jobsResult.map(
        (it) =>
          <Job>{
            id: it.id,
            title: it.title,
            destination: it.destination,
            note: it.note,
            type: it.type,
            pickup_location: it.pickup_location,
            created_at: it.created_at,
            updated_at: it.updated_at,
            customer: <JobCustomer>{
              name: it.customer_name,
            },
          }
      ),
      page_info: {
        count: jobsResult.length,
        page: page,
        total_pages: Math.ceil((resultCount?.count ?? 0) / limit),
      },
    });
  } catch (e) {
    return APIResponse.respondWithServerError();
  }
}
