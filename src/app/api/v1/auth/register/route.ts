import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { generateRandomToken } from "@/lib/utils";
import { hash } from "bcrypt";
import { z } from "zod";

interface POSTResponse {
  id: string;
  name: string;
  email: string;
  token: string;
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { name, email, password } = json;

    const data = z
      .object({
        name: z
          .string({ required_error: "Nama pengguna tidak boleh kosong!" })
          .min(1, "Nama pengguna tidak boleh kosong!"),
        email: z
          .string({ required_error: "Alamat email tidak boleh kosong!" })
          .email("Alamat email tidak valid!"),
        password: z
          .string()
          .min(6, "Kata sandi minimal terdiri dari 6 karakter!"),
      })
      .safeParse({ name, email, password });

    // validasi input dari user
    if (!data.success)
      return APIResponse.respondWithBadRequest(
        data.error.errors.map((it) => ({
          message: it.message,
          path: it.path[0] as string,
        }))
      );

    // cek account existence
    const checkQuery = database
      .selectFrom("users as u")
      .select(["u.id"])
      .where("u.email", "=", email);
    const checkResult = await checkQuery.executeTakeFirst();

    // kembalikan response conflict jika alamat email telah didaftarkan
    if (checkResult)
      return APIResponse.respondWithConflict(
        "Alamat email sudah didaftarkan sebelumnya! Silahkan mencoba untuk masuk"
      );

    // jika belum, lakukan registrasi user baru
    const newToken = generateRandomToken(32);
    const hashedPassword = await hash(password, 12);

    /**
     * harusnya proses create account dan create session dilakukan menggunakan transaction
     * agar ketika salah satu gagal, semua operasi akan ikut gagal. tapi, xata belum support
     * transaction menggunakan library kysely. jadi, untuk sementara di create secara sequential.
     *
     * mungkin bisa dilakukan menggunakan sdk bawaan dari xata, tapi terkendala dengan id
     * yang tidak bisa auto generate.
     */

    // create user account
    const createUserResult = await database
      .insertInto("users")
      .values({
        name: name,
        email: email,
        password: hashedPassword,
      } as any)
      .returning("id")
      .executeTakeFirstOrThrow();

    // create session
    const createSessionResult = await database
      .insertInto("sessions")
      .values({
        token: newToken,
        user: createUserResult.id,
      } as any)
      .returning("token")
      .executeTakeFirstOrThrow();

    if (createSessionResult)
      return APIResponse.respondWithSuccess<POSTResponse>({
        id: createUserResult.id,
        name: name,
        email: email,
        token: createSessionResult.token,
      });

    return APIResponse.respondWithServerError(
      "Terjadi kesalahan tak terduga pada server!"
    );
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError(
      "Terjadi kesalahan tak terduga pada server!"
    );
  }
}
