import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export type SessionType = {
  id: string;
  name: string;
  email: string;
};

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const cookieStore = cookies();
const authTokenKey = "auth-token";

// hanya bisa dijalankan di server side
export const generateAuthToken = async (props: {
  id: string;
  name: string;
  email: string;
}): Promise<string> => {
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
export const getAuthSession = async (): Promise<SessionType | undefined> => {
  const authToken = cookieStore.get(authTokenKey);

  // jika user tidak memiliki auth token
  if (!authToken) return undefined;

  // verify auth token
  const result = await jwtVerify<SessionType>(authToken.value, secret);

  return result.payload;
};
