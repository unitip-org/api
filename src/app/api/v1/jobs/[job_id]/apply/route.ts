import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { NextRequest } from "next/server";
import { z } from "zod";

interface POSTResponse {
  success: boolean;
  id: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { job_id: string } }
) {
  try {
    const json = await request.json();
    const { price } = json;
    const { job_id } = params;
    console.log({ price, job_id });

    // validasi price dan parameter
    const data = z
      .object({
        price: z
          .number({ required_error: "Harga tidak boleh kosong!" })
          .min(0, "Harga tidak boleh negatif!"),
        job_id: z
          .string({ required_error: "Job ID tidak boleh kosong!" })
          .min(1, "Job ID tidak boleh kosong!"),
      })
      .safeParse({ price, job_id });
    if (!data.success)
      return APIResponse.respondWithBadRequest(
        data.error.errors.map((it) => ({
          message: it.message,
          path: it.path[0] as string,
        }))
      );

    // validasi token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();

    // validasi role, karena hanya driver yang bisa apply job
    if (authorization.role !== "driver")
      return APIResponse.respondWithForbidden(
        "Anda tidak memiliki akses untuk melakukan aksi ini!"
      );

    // logika apply job
    const newId = `${authorization.userId}_${job_id}`;
    const query = database
      .insertInto("single_job_applicants")
      .values({
        id: newId,
        price,
        freelancer: authorization.userId,
        job: job_id,
      } as any)
      .returning("id");
    const result = await query.executeTakeFirst();

    // validasi insert record
    if (!result) return APIResponse.respondWithServerError();

    return APIResponse.respondWithSuccess<POSTResponse>({
      success: true,
      id: result.id,
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
}
