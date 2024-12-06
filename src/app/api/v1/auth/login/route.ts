import { database } from "@/lib/database";
import { compare } from "bcrypt";

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     description: Returns the hello world
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hello World!
 */
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
    console.error(e);
    return new Response("Terjadi kesalahan tak terduga pada server!", {
      status: 500,
    });
  }
}
