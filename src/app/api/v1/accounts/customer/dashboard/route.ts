import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { NextRequest } from "next/server";

interface Order {
  id: string;
  note: string;
  type: "job" | "offer";
  status?: string;
}

interface GETResponse {
  need_action: Order[];
  ongoing: Order[];
}

export const GET = async (request: NextRequest) => {
  try {
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();
    const { userId, role } = authorization;

    if (role !== "customer")
      return APIResponse.respondWithForbidden(
        "Anda tidak memiliki akses untuk melakukan aksi ini!"
      );

    const query = database
      .selectFrom("users as u")
      .select((eb) => [
        // Job need action
        jsonArrayFrom(
          eb
            .selectFrom("jobs as j")
            .select(["j.id", "j.note"])
            .where("j.status", "=", "")
            .where("j.customer", "=", userId as any)
        ).as("need_action_jobs"),

        // Job ongoing
        jsonArrayFrom(
          eb
            .selectFrom("jobs as j")
            .select(["j.id", "j.note"])
            .where("j.status", "!=", "")
            .where("j.status", "!=", "done")
            .where("j.customer", "=", userId as any)
        ).as("ongoing_jobs"),

        // Offer need action (pending applications)
        jsonArrayFrom(
          eb
            .selectFrom("offer_applicants as oa")
            .innerJoin("offers as o", "o.id", "oa.offer")
            .select([
              "o.id",
              "o.description as note",
              "oa.applicant_status",
            ])
            .where("oa.customer", "=", userId as any)
            .where("oa.applicant_status", "=", "pending")
        ).as("need_action_offers"),

        // Offer ongoing (accepted, on_the_way)
        jsonArrayFrom(
          eb
            .selectFrom("offer_applicants as oa")
            .innerJoin("offers as o", "o.id", "oa.offer")
            .select([
              "o.id",
              "o.description as note",
              "oa.applicant_status",
            ])
            .where("oa.customer", "=", userId as any)
            .where("oa.applicant_status", "in", ["accepted", "on_the_way", "rejected"])
        ).as("ongoing_offers"),
      ])
      .where("u.id", "=", userId);

    const result = await query.execute();

    return APIResponse.respondWithSuccess<GETResponse>({
      need_action: [
        ...result[0].need_action_jobs.map((it) => ({
          id: it.id,
          note: it.note,
          type: "job" as const 
        })),
        ...result[0].need_action_offers.map((it) => ({
          id: it.id,
          note: it.note,
          type: "offer" as const,
          status: it.applicant_status
        }))
      ],
      ongoing: [
        ...result[0].ongoing_jobs.map((it) => ({
          id: it.id,
          note: it.note,
          type: "job" as const,
        })),
        ...result[0].ongoing_offers.map((it) => ({
          id: it.id,
          note: it.note,
          type: "offer" as const,
          status: it.applicant_status
        }))
      ]
    });
  } catch (e) {
    return APIResponse.respondWithServerError();
  }
};