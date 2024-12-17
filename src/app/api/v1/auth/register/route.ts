import { z } from "zod";

export async function POST(request: Request) {
  try {
    // const authHeader = request.headers.get("Authorization");
    // if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //   return Response.json(
    //     { message: "Token otorisasi tidak ditemukan!" },
    //     { status: 401 }
    //   );
    // }
    // const token = authHeader.substring(7);
    // console.log(token);

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

    if (!data.success)
      return Response.json(
        {
          errors: data.error.errors.map(({ message, path }) => ({
            message,
            path: path[0],
          })),
        },
        { status: 400 }
      );

    return Response.json({ success: true });
  } catch (e) {
    return Response.json(
      { message: "Terjadi kesalahan tak terduga pada server!" },
      { status: 500 }
    );
  }
}
