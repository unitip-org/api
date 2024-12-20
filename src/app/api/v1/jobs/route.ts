import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
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
