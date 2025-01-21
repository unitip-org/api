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

interface DELETEResponse {
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

    // validasi jika job sudah di apply
    const checkApplyQuery = database
      .selectFrom("single_jobs as s")
      .selectAll()
      // .select(sql<number>`count(s.id)`.as("count"))
      .where("s.id", "=", job_id)
      .where("s.freelancer", "is", null);
    const checkApplyResult = await checkApplyQuery.executeTakeFirst();

    if (!checkApplyResult)
      return APIResponse.respondWithConflict(
        "Job sudah diambil oleh orang lain!"
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
    return APIResponse.respondWithServerError();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { job_id: string } }
) {
  try {
    const { job_id: jobId } = params;

    // validasi id
    const data = z
      .object({
        jobId: z
          .string({ required_error: "Job ID tidak boleh kosong!" })
          .min(1, "Job ID tidak boleh kosong!"),
      })
      .safeParse({ jobId });

    if (!data.success)
      return APIResponse.respondWithBadRequest(
        data.error.errors.map((it) => ({
          message: it.message,
          path: it.path[0] as string,
        }))
      );

    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();

    // validasi role, karena hanya driver yang bisa delete apply job
    if (authorization.role !== "driver")
      return APIResponse.respondWithForbidden(
        "Anda tidak memiliki akses untuk melakukan aksi ini!"
      );

    // cek apakah user pernah apply
    const checkApplicant = database
      .selectFrom("single_job_applicants as sja")
      .select("sja.id")
      .where("sja.job", "=", jobId as any)
      .where("sja.freelancer", "=", authorization.userId as any);
    const resultCheckApplicant = await checkApplicant.executeTakeFirst();

    if (!resultCheckApplicant)
      return APIResponse.respondWithNotFound("Pengguna tidak ditemukan!");

    // delete applicant
    const deleteApplicant = database
      .deleteFrom("single_job_applicants")
      .where("id", "=", resultCheckApplicant.id);

    const result = await deleteApplicant.execute();

    if (result)
      return APIResponse.respondWithSuccess<DELETEResponse>({
        success: true,
        id: resultCheckApplicant.id,
      });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
}
