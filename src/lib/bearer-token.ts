"use server";

import { NextRequest } from "next/server";
import { database } from "./database";

interface VerifyResult {
  token: string;
  role: string;
  userId: string;
}

export const verifyBearerToken = async (
  request: NextRequest
): Promise<VerifyResult | undefined> => {
  // mendapatkan token dari header
  const authorization = request.headers.get("Authorization");

  // validasi jika tidak ada token
  if (!authorization || (authorization && !authorization.startsWith("Bearer")))
    return undefined;

  // memisahkan token dari string
  // format penulisan => Bearer initokennya
  const [_, token] = authorization.split(" ");

  if (!token) return undefined;

  // mencari token di database session dan mengambil role
  const query = database
    .selectFrom("user_sessions as s")
    .select(["s.token", "s.role", "s.user"])
    .where("s.token", "=", token);
  const result = await query.executeTakeFirst();

  if (!result) return undefined;

  return {
    token: result.token,
    role: result.role,
    userId: result.user as any,
  };
};
