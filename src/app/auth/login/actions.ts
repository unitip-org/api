"use server";

import { database } from "@/lib/database";
import { ActionResult } from "@/lib/types/action";
import { compare } from "bcrypt";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export const loginUser = async (props: {
  email: string;
  password: string;
}): Promise<ActionResult<boolean>> => {
  try {
    const query = database
      .selectFrom("users as u")
      .select(["u.id", "u.email", "u.password"])
      .where("u.email", "=", props.email);

    // ambil first user berdasarkan email
    const result = await query.executeTakeFirst();
    if (!result) {
      return ["Alamat email atau kata sandi tidak valid!"];
    }

    // validasi kata sandi menggunakan bcrypt
    if (!(await compare(props.password, result.password))) {
      return ["Alamat email atau kata sandi tidak valid!"];
    }

    // valid
    // generate jwt
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const jwt = await new SignJWT({
      id: result.id,
      email: result.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(secret);

    // save jwt to cookie
    const cookieStore = cookies();
    cookieStore.set("auth-token", jwt);

    return [undefined, true];
  } catch (e) {
    return ["Terjadi kesalahan pada server!"];
  }
};
