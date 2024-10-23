import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export default async function Page() {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const cookieStore = cookies();
  const authToken = cookieStore.get("auth-token");

  if (authToken) {
    try {
      const { value } = authToken;
      const token = await jwtVerify(value, secret);
      console.log({ token });
    } catch (e) {
      console.log(e);
    }
  }

  return <></>;
}
