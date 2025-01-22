import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { NextRequest } from "next/server";
import { z } from "zod";

interface POSTBody {
  title: string;
  destination: string;
  note: string | undefined;
  type: "antar-jemput";
  pickup_location: string;
}
interface POSTResponse {
  success: boolean;
  id: string;
}
export const POST = async (request: NextRequest) => {
  try {
    // mendapatkan request dari user
    const { title, destination, note, type, pickup_location }: POSTBody =
      await request.json();

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
        type: z.enum(["antar-jemput"]),
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

    // query membuat single job
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
  } catch (e) {
    return APIResponse.respondWithServerError();
  }
};
