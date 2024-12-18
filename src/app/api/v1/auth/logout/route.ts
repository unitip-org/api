import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { NextRequest } from "next/server";

interface DELETEResponse {
  success: boolean;
  message: string;
}

export async function DELETE(request: NextRequest) {
  try {
    // verify bearer token, serta mendapatkan token, role, dan userId
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();

    const deleteQuery = database
      .deleteFrom("sessions")
      .where("token", "=", authorization.token)
      .returning("id");
    const deleteResult = await deleteQuery.executeTakeFirst();

    if (deleteResult)
      return APIResponse.respondWithSuccess<DELETEResponse>({
        success: true,
        message: "Berhasil keluar dari akun!",
      });

    return APIResponse.respondWithServerError(
      "Terjadi kesalahan tak terduga pada server!"
    );
  } catch (e) {
    return APIResponse.respondWithServerError(
      "Terjadi kesalahan tak terduga pada server!"
    );
  }
}
