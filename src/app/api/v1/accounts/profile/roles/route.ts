import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { NextRequest } from "next/server";
import { v4 } from "uuid";
import { z } from "zod";

interface GETResponse {
  roles: string[];
}
export const GET = async (request: NextRequest) => {
  try {
    // verifikasi bearer token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();
    const { userId } = authorization;

    const query = database
      .selectFrom("user_roles as ur")
      .select(["ur.role"])
      .where("ur.user", "=", userId as any);

    const result = await query.execute();

    return APIResponse.respondWithSuccess<GETResponse>({
      roles: result.map((it) => it.role),
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
};

interface PATCHBody {
  role: string;
}
interface PATCHResponse {
  id: string;
  token: string;
  role: string;
}
export const PATCH = async (request: NextRequest) => {
  try {
    // validasi request dari user
    const { role }: PATCHBody = await request.json();
    const validate = z
      .object({
        role: z.enum(["customer", "driver"]),
      })
      .safeParse({ role });
    if (!validate.success)
      return APIResponse.respondWithBadRequest(
        validate.error.errors.map((it) => ({
          message: it.message,
          path: it.path[0] as string,
        }))
      );

    // verifikasi authentication token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();
    const { token } = authorization;

    // generate token baru
    const newToken = v4();

    // update role serta simpan token baru ke database session
    const query = database
      .updateTable("user_sessions")
      .set({ role: role, token: newToken })
      .where("token", "=", token)
      .returning(["role", "token", "user"]);
    const result = await query.executeTakeFirstOrThrow();

    return APIResponse.respondWithSuccess<PATCHResponse>({
      id: result.user as any,
      role: result.role,
      token: result.token,
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
};
