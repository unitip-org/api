import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { NextRequest } from "next/server";
import { v4 } from "uuid";
import { z } from "zod";

interface POSTBody {
  title: string;
  note: string | undefined;
  service: "jasa-titip";
  pickup_location: string;
}

interface POSTResponse {
  success: boolean;
  id: string;
}

export const POST = async (request: NextRequest) => {
  try {
    const { title, note, service, pickup_location }: POSTBody =
      await request.json();

    // validasi input dari user
    const data = z
      .object({
        title: z
          .string({ required_error: "Judul tidak boleh kosong!" })
          .min(1, "Judul tidak boleh kosong!"),
        note: z.string().optional(),
        service: z.enum(["antar-jemput"]),
        pickup_location: z
          .string({ required_error: "Lokasi jemput tidak boleh kosong!" })
          .min(1, "Lokasi jemput tidak boleh kosong!"),
      })
      .safeParse({ title, note, service, pickup_location });

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
    const { role, userId } = authorization;

    // validasi role
    if (role !== "customer")
      return APIResponse.respondWithForbidden(
        "Anda tidak memiliki akses untuk membuat job!"
      );

    // query multi job
    const newUuid = v4();
    const query = database
      .insertInto("single_jobs")
      .values({
        id: newUuid,
        title,
        note,
        service,
        pickup_location,
        customer: userId,
      } as any)
      .returning("id");
    const result = await query.executeTakeFirstOrThrow();
  } catch (e) {
    return APIResponse.respondWithServerError();
  }
};
