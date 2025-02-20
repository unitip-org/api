import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { NextRequest } from "next/server";
import { z } from "zod";

interface Params {
  params: {
    activity_id: string;
  };
}

interface GETResponse {
  id: string;
  content: string;
  children: {
    id: string;
    content: string;
  }[];
}
export const GET = async (request: NextRequest, { params }: Params) => {
  try {
    // validasi request dari user
    const { activity_id: activityId } = params;
    const validate = z
      .object({
        activityId: z
          .string({ required_error: "ID aktivitas tidak boleh kosong!" })
          .min(1, "ID aktivitas tidak boleh kosong!"),
      })
      .safeParse({ activityId });
    if (!validate.success)
      return APIResponse.respondWithBadRequest(
        validate.error.errors.map((it) => ({
          path: it.path[0] as string,
          message: it.message,
        }))
      );

    // validasi bearer token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();

    // query untuk mendapatkan detail activity
    const query = database
      .selectFrom("activities as a")
      .select((eb) => [
        "a.id",
        "a.content",
        jsonArrayFrom(
          eb
            .selectFrom("activities as a2")
            .select(["a2.id", "a2.content"])
            .whereRef("a2.parent", "=", "a.id")
        ).as("children"),
      ])
      .where("a.id", "=", activityId);
    const result = await query.executeTakeFirst();

    if (!result)
      return APIResponse.respondWithNotFound("Aktivitas tidak ditemukan!");

    return APIResponse.respondWithSuccess<GETResponse>({
      id: result.id,
      content: result.content,
      children: result.children,
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
};
