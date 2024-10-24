import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export type SessionType = {
  id: string;
  name: string;
  email: string;
};

// hanya bisa dijalankan di server side
export const createAuthSession = () => {};

// hanya bisa dijalankan di server side
export const getAuthSession = async (): Promise<SessionType | undefined> => {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth-token");

  // jika user tidak memiliki auth token
  if (!authToken) return undefined;

  // verify auth token
  const secret = process.env.JWT_SECRET;
  const result = await jwtVerify<SessionType>(
    authToken.value,
    new TextEncoder().encode(secret)
  );

  return result.payload;
};
