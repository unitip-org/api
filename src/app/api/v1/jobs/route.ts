import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
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

    // const jobsQuery = database
    //   .selectFrom("single_jobs as sj")
    //   .innerJoin("users as u", "u.id", "sj.customer")
    //   .select([
    //     "sj.id",
    //     "sj.title",
    //     "sj.destination",
    //     "sj.note",
    //     "sj.service",
    //     "sj.pickup_location",
    //     "u.name as customer_name",
    //   ])
    //   .select(sql<string>`sj."xata.createdAt"`.as("created_at"))
    //   .select(sql<string>`sj."xata.updatedAt"`.as("updated_at"))
    //   .offset((page - 1) * limit)
    //   .orderBy("created_at", "desc")
    //   .limit(limit);
    const jobsQuery = database
      .selectFrom((qb) =>
        qb
          .selectFrom("single_jobs as sj")
          .innerJoin("users as u", "u.id", "sj.customer")
          .select("sj.id")
          .select(sql<string>`'single'`.as("type"))
          .select("sj.title")
          .select("sj.destination")
          .select("sj.note")
          .select("sj.service")
          .select("sj.pickup_location")
          .select("u.name as customer_name")
          .select(sql<string>`sj."xata.createdAt"`.as("created_at"))
          .select(sql<string>`sj."xata.updatedAt"`.as("updated_at"))
          .unionAll((qb) =>
            qb
              .selectFrom("multi_jobs as mj")
              .innerJoin("users as u", "u.id", "mj.customer")
              .select("mj.id")
              .select(sql<string>`'multi'`.as("type"))
              .select("mj.title")
              .select(sql<string>`'null'`.as("destination"))
              .select(sql<string>`'null'`.as("note"))
              .select(sql<string>`'null'`.as("service"))
              .select("mj.pickup_location")
              .select("u.name as customer_name")
              .select(sql<string>`mj."xata.createdAt"`.as("created_at"))
              .select(sql<string>`mj."xata.updatedAt"`.as("updated_at"))
          )
          .as("jobs")
      )
      .selectAll()
      .offset((page - 1) * limit)
      .limit(limit)
      .orderBy("created_at", "desc");
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
            type: it.type,
            title: it.title,
            destination: it.destination,
            note: it.note,
            service: it.service,
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
    console.log(e);
    return APIResponse.respondWithServerError();
  }
}
