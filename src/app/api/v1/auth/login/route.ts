import { database } from "@/lib/database";
import { compare } from "bcrypt";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { email, password } = json;

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
    return new Response("Terjadi kesalahan tak terduga pada server!", {
      status: 500,
    });
  }
}
