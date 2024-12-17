import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { generateRandomToken } from "@/lib/utils";
import { compare } from "bcrypt";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { email, password, role } = json;

    if (role) {
      /**
       * percobaan kedua
       * masukkan user menggunakan role yang diminta.
       */
      const parsedData = z
        .object({
          email: z
            .string({ required_error: "Alamat email tidak boleh kosong!" })
            .email("Alamat email tidak valid!"),
          password: z
            .string({ required_error: "Kata sandi tidak boleh kosong!" })
            .min(6, "Kata sandi minimal terdiri dari 6 karakter!"),
          role: z
            .string({ required_error: "Role tidak boleh kosong!" })
            .min(1, "Role tidak boleh kosong!"),
        })
        .safeParse({ email, password, role });

      if (!parsedData.success)
        return APIResponse.BadRequestError(
          parsedData.error.errors.map((it) => ({
            message: it.message,
            path: it.path[0] as string,
          }))
        );

      const userQuery = database
        .selectFrom("users as u")
        .innerJoin("user_roles as ur", "ur.user", "u.id")
        .leftJoin("sessions as s", "s.user", "u.id")
        .select([
          "u.id",
          "u.name",
          "u.email",
          "u.password",
          "ur.role",
          "s.token",
        ])
        .where("u.email", "=", email)
        .where("ur.role", "=", role);
      const userResult = await userQuery.executeTakeFirst();

      // validasi user account existence dan kata sandi
      if (
        !userResult ||
        (userResult && !(await compare(password, userResult.password)))
      )
        return APIResponse.NotFoundError(
          "Alamat email atau kata sandi tidak valid!"
        );

      // cek apakah user sedang memiliki session
      const newToken = generateRandomToken(32);
      if (userResult.token) {
        const sessionQuery = database
          .updateTable("sessions")
          .where("user", "=", userResult.id as any)
          .set({
            token: newToken,
          })
          .returning("token");
        const sessionResult = await sessionQuery.executeTakeFirst();

        if (sessionResult)
          return APIResponse.Success({
            need_role: false,
            roles: [],
            id: userResult.id,
            name: userResult.name,
            email: userResult.email,
            token: sessionResult,
          });
      } else {
        const sessionQuery = database
          .insertInto("sessions")
          .values({
            token: newToken,
            user: userResult.id,
          } as any)
          .returning("token");
        const sessionResult = await sessionQuery.executeTakeFirst();

        if (sessionResult)
          return APIResponse.Success({
            need_role: false,
            roles: [],
            id: userResult.id,
            name: userResult.name,
            email: userResult.email,
            token: sessionResult,
          });
      }
    } else {
      /**
       * percobaan pertama
       * jika user tidak memiliki role ganda, maka login user menggunakan role tersebut.
       * jika user memiliki role ganda, maka kembalikan daftar role ke user, kemudian
       * user diminta untuk mengulangi percobaan login dengan menyertakan role yang
       * akan digunakan.
       */
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

      if (!parsedData.success)
        return APIResponse.BadRequestError(
          parsedData.error.errors.map((it) => ({
            message: it.message,
            path: it.path[0] as string,
          }))
        );

      const usersQuery = database
        .selectFrom("users as u")
        .innerJoin("user_roles as ur", "ur.user", "u.id")
        .leftJoin("sessions as s", "s.user", "u.id")
        .select([
          "u.id",
          "u.name",
          "u.email",
          "u.password",
          "ur.role",
          "s.token",
        ])
        .where("u.email", "=", email);
      const usersResult = await usersQuery.execute();

      // validasi user account existence dan kata sandi
      if (
        usersResult.length === 0 ||
        (usersResult.length > 0 &&
          !(await compare(password, usersResult[0].password)))
      )
        return APIResponse.NotFoundError(
          "Alamat email atau kata sandi tidak valid!"
        );

      // validasi jika role > 1, maka minta user untuk login percobaan kedua
      if (usersResult.length > 1)
        return APIResponse.Success({
          need_role: true,
          roles: usersResult.map((it) => it.role),
        });

      // jika len result === 1, alias user hanya punya 1 role saja
      const firstUser = usersResult[0];
      const newToken = generateRandomToken(32);

      // cek apakah user sedang memiliki session
      if (firstUser.token) {
        const sessionQuery = database
          .updateTable("sessions")
          .where("user", "=", firstUser.id as any)
          .set({
            token: newToken,
          })
          .returning("token");
        const sessionResult = await sessionQuery.executeTakeFirst();

        if (sessionResult)
          return APIResponse.Success({
            need_role: false,
            roles: [],
            id: firstUser.id,
            name: firstUser.name,
            email: firstUser.email,
            token: sessionResult,
          });
      } else {
        const sessionQuery = database
          .insertInto("sessions")
          .values({
            token: newToken,
            user: firstUser.id,
          } as any)
          .returning("token");
        const sessionResult = await sessionQuery.executeTakeFirst();

        if (sessionResult)
          return APIResponse.Success({
            need_role: false,
            roles: [],
            id: firstUser.id,
            name: firstUser.name,
            email: firstUser.email,
            token: sessionResult,
          });
      }
    }

    return APIResponse.InternalServerError(
      "Terjadi kesalahan tak terduga pada server!"
    );
  } catch (e) {
    return APIResponse.InternalServerError(
      "Terjadi kesalahan tak terduga pada server!"
    );
  }
}
