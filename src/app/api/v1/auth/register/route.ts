import { z } from "zod";

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - auth
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                       path:
 *                         type: string
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
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

    if (!data.success)
      return Response.json({
        errors: data.error.errors.map(({ message, path }) => ({
          message,
          path: path[0],
        })),
      });

    return Response.json({ success: true });
  } catch (e) {
    return Response.json(
      { message: "Terjadi kesalahan tak terduga pada server!" },
      { status: 500 }
    );
  }
}
