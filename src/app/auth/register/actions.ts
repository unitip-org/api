"use server";

import { generateAuthToken } from "@/lib/auth-token";
import { database } from "@/lib/database";
import { ActionResult } from "@/lib/types/action";
import { hash } from "bcrypt";
import { cookies } from "next/headers";

export const registerCustomer = async (props: {
  name: string;
  email: string;
  password: string;
}): Promise<ActionResult<boolean>> => {
  try {
    // check email apakah sudah terdaftar atau belum
    const checkQuery = database
      .selectFrom("users as u")
      .select("u.id")
      .where("u.email", "=", props.email);

    const firstUser = await checkQuery.executeTakeFirst();
    if (firstUser)
      return [
        "Alamat email sudah terdaftar! Silahkan masuk " +
          "menggunakan informasi akun yang sudah ada.",
      ];

    // jika email belum terdaftar, maka buat akun baru
    const hashedPassword = await hash(props.password, 12);
    const query = database
      .insertInto("users")
      .values({
        name: props.name,
        email: props.email,
        password: hashedPassword,
        roles: ["customer"],
      } as any)
      .returning("id");

    const result = await query.execute();
    if (result.length > 0) {
      const id = result[0].id;

      // save token to cookie
      const authToken = await generateAuthToken({
        id,
        email: props.email,
        name: props.name,
      });
      const cookieStore = cookies();
      cookieStore.set("auth-token", authToken);

      return [undefined, true];
    }
    return ["Gagal membuat akun baru! Silahkan coba lagi nanti."];
  } catch (e) {
    return [
      "Terjadi kesalahan saat membuat akun baru! Silahkan coba lagi nanti.",
    ];
  }
};
