import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { NextRequest } from "next/server";
import { z } from "zod";

interface Params {
  params: {
    job_id: string;
    application_id: string;
  };
}

interface PATCHResponse {
  id: string;
}
export const PATCH = async (request: NextRequest, { params }: Params) => {
  try {
    // verifikasi request dari user
    const { job_id: jobId, application_id: applicationId } = params;
    const validate = z
      .object({
        jobId: z
          .string({ required_error: "ID pekerjaan tidak boleh kosong!" })
          .min(1, "ID pekerjaan tidak boleh kosong!"),
        applicationId: z
          .string({
            required_error: "ID aplikasi pekerjaan tidak boleh kosong!",
          })
          .min(1, "ID aplikasi pekerjaan tidak boleh kosong!"),
      })
      .safeParse({ jobId, applicationId });
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
        "Anda tidak memiliki akses untuk menghapus aplikasi pekerjaan!"
      );

    // approve job application
    const applicationQuery = database
      .selectFrom("job_applications as ja")
      .select(["ja.price", "ja.freelancer"])
      .where("ja.job", "=", jobId as any)
      .where("ja.id", "=", applicationId);
    const applicationResult = await applicationQuery.executeTakeFirstOrThrow();

    const query = database
      .updateTable("jobs")
      .set({
        price: applicationResult.price,
        status: "ongoing",
        freelancer: applicationResult.freelancer,
      })
      .returning("id");
    const result = await query.executeTakeFirstOrThrow();

    return APIResponse.respondWithSuccess<PATCHResponse>({
      id: result.id,
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
};
