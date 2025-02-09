import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { convertDatetimeToISO } from "@/lib/utils";
import { sql } from "kysely";
import { NextRequest } from "next/server";
import { z } from "zod";

interface POSTBody {
  note: string;
  pickup_location: string;
  destination_location: string;
  service: string;
  expected_price: number;
}
interface POSTResponse {
  id: string;
}
export const POST = async (request: NextRequest) => {
  try {
    // validasi request dari user
    const {
      note,
      pickup_location: pickupLocation,
      destination_location: destinationLocation,
      service,
      expected_price: expectedPrice,
    }: POSTBody = await request.json();

    const validate = z
      .object({
        note: z.string().optional(),
        pickupLocation: z
          .string({ required_error: "Lokasi penjemputan tidak boleh kosong!" })
          .min(1, "Lokasi penjemputan tidak boleh kosong!"),
        destinationLocation: z
          .string({ required_error: "Lokasi tujuan tidak boleh kosong!" })
          .min(1, "Lokasi tujuan tidak boleh kosong!"),
        service: z.enum(["antar-jemput", "jasa-titip"], {
          required_error: "Jenis layanan tidak boleh kosong!",
        }),
        expectedPrice: z
          .number({
            required_error: "Harga yang diharapkan tidak boleh kosong!",
          })
          .min(0, "Harga yang diharapkan tidak boleh kurang dari 0!"),
      })
      .safeParse({
        note,
        pickupLocation,
        destinationLocation,
        service,
        expectedPrice,
      });
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
        "Anda tidak memiliki akses untuk membuat pekerjaan!"
      );

    // membuat job baru
    const query = database
      .insertInto("jobs")
      .values({
        note,
        pickup_location: pickupLocation,
        destination_location: destinationLocation,
        service,
        expected_price: expectedPrice,
        customer: userId,
      } as any)
      .returning(["id"]);
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
  jobs: {
    id: string;
    note: string;
    pickup_location: string;
    destination_location: string;
    service: string;
    created_at: string;
    updated_at: string;
    customer: {
      name: string;
    };
  }[];
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

    // const jobsQuery = database
    //   .selectFrom((qb) =>
    //     qb
    //       .selectFrom("single_jobs as sj")
    //       .innerJoin("users as u", "u.id", "sj.customer")
    //       .select((eb) => [
    //         "sj.id",
    //         sql<string>`'single'`.as("type"),
    //         "sj.title",
    //         "sj.destination",
    //         "sj.note",
    //         "sj.service",
    //         "sj.pickup_location",
    //         "u.name as customer_name",
    //         sql<string>`sj."xata.createdAt"`.as("created_at"),
    //         sql<string>`sj."xata.updatedAt"`.as("updated_at"),
    //         eb
    //           .selectFrom("single_job_applications as sja")
    //           .select((eb) => eb.fn.count("sja.id").as("total_applications"))
    //           .whereRef("sja.job", "=", "sj.id")
    //           .as("total_applications"),
    //       ])
    //       .unionAll((qb) =>
    //         qb
    //           .selectFrom("multi_jobs as mj")
    //           .innerJoin("users as u", "u.id", "mj.customer")
    //           .select((eb) => [
    //             "mj.id",
    //             sql<string>`'multi'`.as("type"),
    //             "mj.title",
    //             sql<string>`'null'`.as("destination"),
    //             sql<string>`'null'`.as("note"),
    //             sql<string>`'null'`.as("service"),
    //             "mj.pickup_location",
    //             "u.name as customer_name",
    //             sql<string>`mj."xata.createdAt"`.as("created_at"),
    //             sql<string>`mj."xata.updatedAt"`.as("updated_at"),
    //             eb
    //               .selectFrom("multi_job_applications as mja")
    //               .select((eb) =>
    //                 eb.fn.count("mja.id").as("total_applications")
    //               )
    //               .whereRef("mja.job", "=", "mj.id")
    //               .as("total_applications"),
    //           ])
    //       )
    //       .as("jobs")
    //   )
    //   .selectAll()
    //   .offset((page - 1) * limit)
    //   .limit(limit)
    //   .orderBy("created_at", "desc");

    /**
     * masih kurang filter berdasarkan status, untuk role driver
     * tampilkan hanya jobs yang masih belum diambil
     */
    const jobsQuery = database
      .selectFrom("jobs as j")
      .innerJoin("users as u", "u.id", "j.customer")
      .select([
        "j.id",
        "j.note",
        "j.pickup_location",
        "j.destination_location",
        "j.service",
        sql<string>`j."xata.createdAt"`.as("created_at"),
        sql<string>`j."xata.updatedAt"`.as("updated_at"),
        "u.name as customer_name",
      ])
      .where("j.freelancer", "is", null)
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy("created_at", "desc");
    const jobsResult = await jobsQuery.execute();

    return APIResponse.respondWithSuccess<GETResponse>({
      jobs: jobsResult.map((it) => ({
        id: it.id,
        note: it.note,
        pickup_location: it.pickup_location,
        destination_location: it.destination_location,
        service: it.service,
        created_at: convertDatetimeToISO(it.created_at),
        updated_at: convertDatetimeToISO(it.updated_at),
        customer: {
          name: it.customer_name,
        },
      })),
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
}
