import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { convertDatetimeToISO } from "@/lib/utils";
import { sql } from "kysely";
import { NextRequest } from "next/server";

interface JobCustomer {
  name: string;
}
interface Job {
  id: string;
  title: string;
  destination: string;
  note: string;
  service: string;
  pickup_location: string;
  created_at: string;
  updated_at: string;
  customer: JobCustomer;
  total_applications: number;
}

interface GETResponse {
  jobs: Job[];
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
      .selectFrom((qb) =>
        qb
          .selectFrom("single_jobs as sj")
          .innerJoin("users as u", "u.id", "sj.customer")
          .select((eb) => [
            "sj.id",
            sql<string>`'single'`.as("type"),
            "sj.title",
            "sj.destination",
            "sj.note",
            "sj.service",
            "sj.pickup_location",
            "u.name as customer_name",
            sql<string>`sj."xata.createdAt"`.as("created_at"),
            sql<string>`sj."xata.updatedAt"`.as("updated_at"),
            eb
              .selectFrom("single_job_applications as sja")
              .select((eb) => eb.fn.count("sja.id").as("total_applications"))
              .whereRef("sja.job", "=", "sj.id")
              .as("total_applications"),
          ])
          .unionAll((qb) =>
            qb
              .selectFrom("multi_jobs as mj")
              .innerJoin("users as u", "u.id", "mj.customer")
              .select((eb) => [
                "mj.id",
                sql<string>`'multi'`.as("type"),
                "mj.title",
                sql<string>`'null'`.as("destination"),
                sql<string>`'null'`.as("note"),
                sql<string>`'null'`.as("service"),
                "mj.pickup_location",
                "u.name as customer_name",
                sql<string>`mj."xata.createdAt"`.as("created_at"),
                sql<string>`mj."xata.updatedAt"`.as("updated_at"),
                eb
                  .selectFrom("multi_job_applications as mja")
                  .select((eb) =>
                    eb.fn.count("mja.id").as("total_applications")
                  )
                  .whereRef("mja.job", "=", "mj.id")
                  .as("total_applications"),
              ])
          )
          .as("jobs")
      )
      .selectAll()
      .offset((page - 1) * limit)
      .limit(limit)
      .orderBy("created_at", "desc");
    const jobsResult = await jobsQuery.execute();

    return APIResponse.respondWithSuccess<GETResponse>({
      jobs: jobsResult.map(
        (it) =>
          <Job>{
            id: it.id,
            type: it.type,
            title: it.title,
            destination: it.destination,
            note: it.note,
            service: it.service,
            pickup_location: it.pickup_location,
            created_at: convertDatetimeToISO(it.created_at),
            updated_at: convertDatetimeToISO(it.updated_at),
            total_applications: it.total_applications,
            customer: <JobCustomer>{
              name: it.customer_name,
            },
          }
      ),
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
}
