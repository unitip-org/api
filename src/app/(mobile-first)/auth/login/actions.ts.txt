"use server";

import { AuthTokenType, generateAuthToken } from "@/lib/auth-token";
import { database } from "@/lib/database";
import { ActionResult } from "@/lib/types/action";
import { compare } from "bcrypt";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export const login = async (props: {
  email: string;
  password: string;
}): Promise<AuthTokenType[]> => {
  try {
    const query = database
      .selectFrom("users as u")
      .select(["u.id", "u.name", "u.email", "u.password"])
      .where("u.email", "=", props.email);

    // ambil first user berdasarkan email
    const result = await query.executeTakeFirst();
    if (!result) throw new Error("Alamat email atau kata sandi tidak valid!");

    // validasi kata sandi menggunakan bcrypt
    if (!(await compare(props.password, result.password)))
      throw new Error("Alamat email atau kata sandi tidak valid!");

    // ambil role
    const queryRole = database
      .selectFrom("user_roles as ur")
      .select(["ur.role"])
      .where("ur.user", "=", result.id as any);

    const roles = await queryRole.execute();
    if (roles.length === 0) throw new Error("Role tidak ditemukan!");

    if (roles.length === 1) {
      // jika role.length === 1, maka langsung login sebagai role tersebut
      const role = roles[0];
      if (!role) throw new Error("Role tidak ditemukan!");

      const jwt = await generateAuthToken({
        ...result,
        role: role.role,
      });

      // save jwt to cookie
      const cookieStore = cookies();
      cookieStore.set("auth-token", jwt);

      return [];
    } else {
      // jika role.length > 1, maka harus pilih role
      return roles.map((role) => ({
        ...result,
        role: role.role,
      }));
    }
  } catch (e) {
    throw e;
  }
};

export const commitRole = async (props: AuthTokenType) => {
  try {
    const jwt = await generateAuthToken({
      ...props,
    });

    // save jwt to cookie
    const cookieStore = cookies();
    cookieStore.set("auth-token", jwt);
  } catch (e) {
    throw e;
  }
};

/**
 * @deprecated
 */
export const loginUser = async (props: {
  email: string;
  password: string;
}): Promise<ActionResult<boolean>> => {
  try {
    const query = database
      .selectFrom("users as u")
      .select(["u.id", "u.name", "u.email", "u.password"])
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
      name: result.name,
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
