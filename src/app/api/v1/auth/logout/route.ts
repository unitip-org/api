import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { NextRequest } from "next/server";

interface DELETEResponse {
  success: boolean;
  message: string;
}

export async function DELETE(request: NextRequest) {
  try {
    // mendapatkan token dari header
    const authorization = request.headers.get("Authorization");

    // validasi jika tidak ada token
    if (
      !authorization ||
      (authorization && !authorization.startsWith("Bearer"))
    )
      return APIResponse.respondWithUnauthorized();

    // memisahkan token dari string
    // format penulisan => Bearer initokennya
    const [_, token] = authorization.split(" ");

    const deleteQuery = database
      .deleteFrom("sessions")
      .where("token", "=", token)
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
