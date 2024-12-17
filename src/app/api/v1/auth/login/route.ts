import { database } from "@/lib/database";
import { compare } from "bcrypt";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { email, password } = json;

    const parsedData = z
      .object({
        email: z
          .string({ required_error: "Alamat email tidak boleh kosong!" })
          .email("Alamat email tidak valid!"),
        password: z
          .string({ required_error: "Kata sandi tidak boleh kosong!" })
          .min(6, "Kata sandi minimal terdiri dari 6 karakter!"),
      })
      .safeParse({ email, password });

    if (!parsedData.success) {
      return Response.json(
        {
          errors: parsedData.error.errors.map((it) => ({
            message: it.message,
            path: it.path[0],
          })),
        },
        { status: 400 }
      );
    }

    const query = database
      .selectFrom("users as u")
      .select(["u.id", "u.name", "u.email", "u.password"])
      .where("u.email", "=", email);
    const result = await query.executeTakeFirst();

    // email tidak ditemukan
    if (!result)
      return new Response("Alamat email atau kata sandi tidak valid!", {
        status: 400,
      });

    // validasi kata sandi
    if (!(await compare(password, result.password)))
      return new Response("Alamat email atau kata sandi tidak valid!", {
        status: 400,
      });

    return Response.json({
      id: result.id,
      name: result.name,
      email: result.email,
      token: "gatau",
    });
  } catch (e) {
    return Response.json(
      { message: "Terjadi kesalahan tak terduga pada server!" },
      {
        status: 500,
      }
    );
  }
}
