import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { NextRequest } from "next/server";
import { z } from "zod";

interface GETResponse {
  roles: string[];
}

export const GET = async (request: NextRequest) => {
  try {
    // verifikasi bearer token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();
    const { userId, role } = authorization;

    const query = database
      .selectFrom("user_roles as ur")
      .select(["ur.role"])
      .where("ur.user", "=", userId as any);

    const result = await query.execute();

    return APIResponse.respondWithSuccess<GETResponse>({
      roles: result.map((it) => it.role),
    });
  } catch (e) {
    return APIResponse.respondWithServerError();
  }
};

interface PATCHBody {
  role: string;
}

interface PATCHResponse {
  id: string;
}

export const PATCH = async (request: NextRequest) => {
  try {
    const { role }: PATCHBody = await request.json();

    const validate = z
      .object({
        role: z
          .string({ required_error: "Role tidak boleh kosong!" })
          .min(1, "Role tidak boleh kosong!"),
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

    const query = database
      .updateTable("user_sessions")
      .set({ role: role })
      .where("token", "=", token)
      .returning(["role", "token", "user"]);

    const result = await query.executeTakeFirstOrThrow();

    return APIResponse.respondWithSuccess<PATCHResponse>({
      id: result.user as any,
    });
  } catch (e) {
    return APIResponse.respondWithServerError();
  }
};
