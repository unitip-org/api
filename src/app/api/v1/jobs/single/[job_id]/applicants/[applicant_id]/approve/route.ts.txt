import { verifyBearerToken } from "@/lib/bearer-token";
import { database, xata } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";

import { NextRequest } from "next/server";
import { z } from "zod";

interface GETResponse {
  success: boolean;
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { job_id: string; applicant_id: string } }
) {
  try {
    // const json = await request.json();
    // const { price } = json;
    const { job_id: jobId, applicant_id: applicantId } = params;

    // validasi harga dan parameter (job_id dan applicant_id)
    const data = z
      .object({
        // price: z
        //   .number({ required_error: "Harga tidak boleh kosong!" })
        //   .min(1, "Harga tidak boleh negatif!"),
        jobId: z
          .string({ required_error: "Job ID tidak boleh kosong!" })
          .min(1, "Job ID tidak boleh kosong!"),
        applicantId: z
          .string({ required_error: "Applicant ID tidak boleh kosong!" })
          .min(1, "Applicant ID tidak boleh kosong!"),
      })
      .safeParse({ jobId, applicantId });
    if (!data.success)
      return APIResponse.respondWithBadRequest(
        data.error.errors.map((it) => ({
          message: it.message,
          path: it.path[0] as string,
        }))
      );

    // validasi token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized;

    // validasi role karena approve hanya bisa dilakukan oleh customer
    if (authorization.role !== "customer")
      return APIResponse.respondWithForbidden(
        "Anda tidak memiliki akses untuk melakukan aksi ini"
      );

    // validasi jika freelancer membatalkan lamaran
    const checkFreelancerApply = database
      .selectFrom("single_job_applicants as sja")
      .where("sja.job", "=", jobId as any)
      .where("sja.id", "=", applicantId as any);
    const resultFreelancerApply = await checkFreelancerApply.executeTakeFirst();

    if (!resultFreelancerApply)
      return APIResponse.respondWithNotFound("Pengguna tidak ditemukan!");

    // validasi jika freelancer telah diapprove di job lain
    // const freelancerId = database
    //   .selectFrom("single_job_applicants as sja")
    //   .select("sja.freelancer")
    //   .where("sja.job", "=", jobId as any)
    //   .where("sja.id", "=", applicantId as any);
    // const resultFreelancerId = await freelancerId.execute();

    // mendapatkan semua lamaran dari driver
    const queryApplicants = database
      .selectFrom("single_job_applicants as sja")
      .select(["sja.id", "sja.price", "sja.freelancer"])
      .where("sja.job", "=", jobId as any);
    const resultApplicants = await queryApplicants.execute();

    // ambil lamaran yang sesuai dengan id saat ini
    const currentApplicant = resultApplicants.find(
      (it) => it.id === applicantId
    );

    // validasi jika job telah diambil driver lain
    if (resultApplicants.length === 0 || !currentApplicant)
      return APIResponse.respondWithNotFound("Driver tidak ditemukan!");

    const freelancerId = currentApplicant.freelancer;

    const checkFreelancerJob = database
      .selectFrom("single_jobs as sj")
      .selectAll()
      .where("sj.freelancer", "=", freelancerId as any)
      .where("sj.status", "!=", "done");
    const resultFreelancerJob = await checkFreelancerJob.execute();

    console.log(resultFreelancerJob);
    if (resultFreelancerJob.length !== 0)
      return APIResponse.respondWithConflict(
        "Driver sudah mengambil job lain!"
      );

    // transaksi untuk delete lamaran dan update table single jobs
    const result = await xata.transactions.run([
      // query untuk update
      {
        update: {
          table: "single_jobs",
          id: jobId,
          fields: {
            price: currentApplicant.price,
            freelancer: currentApplicant.freelancer,
            status: "ongoing",
          },
        },
      },

      // query untuk delete semua aplicants
      ...resultApplicants.map(
        (it) =>
          ({
            delete: {
              table: "single_job_applicants",
              id: it.id,
            },
          } as any)
      ),
    ]);
    console.log(result);

    return APIResponse.respondWithSuccess<GETResponse>({
      success: true,
      id: "dummy",
    });

    // const checkJob;
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
}
