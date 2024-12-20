import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export type AuthTokenType = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const authTokenKey = "auth-token";

// hanya bisa dijalankan di server side
export const generateAuthToken = async (
  props: AuthTokenType
): Promise<string> => {
  // generate jwt
  const jwt = await new SignJWT({
    ...props,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secret);

  return jwt;
};

// hanya bisa dijalankan di server side
export const verifyAuthToken = async (): Promise<AuthTokenType> => {
  const cookieStore = cookies();
  const authToken = cookieStore.get(authTokenKey);

  // jika user tidak memiliki auth token
  if (!authToken) throw new Error("Unauthorized");

  // verify auth token
  const { payload } = await jwtVerify<AuthTokenType>(authToken.value, secret);
  return payload;
};
