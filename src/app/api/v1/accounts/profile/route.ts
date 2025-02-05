import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { NextRequest } from "next/server";
import { z } from "zod";

interface GETResponse {
  id: string;
  name: string;
  email: string;
  token: string;
  role: string;
  gender: string;
}

export const GET = async (request: NextRequest) => {
  try {
    // verifikasi bearer token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();
    const { token } = authorization;

    const query = database
      .selectFrom("user_sessions as us")
      .innerJoin("users as u", "u.id", "us.user")
      .select(["u.id", "u.name", "u.email", "us.token", "us.role", "u.gender"])
      .where("us.token", "=", token);

    const result = await query.executeTakeFirstOrThrow();

    return APIResponse.respondWithSuccess<GETResponse>({
      id: result.id,
      name: result.name,
      email: result.email,
      role: result.role,
      token: result.token,
      gender: result.gender,
    });
  } catch (e) {
    return APIResponse.respondWithServerError();
  }
};

interface PATCHBody {
  name: string;
  gender: string;
}

interface PATCHResponse {
  id: string;
}

export const PATCH = async (request: NextRequest) => {
  try {
    const { name, gender }: PATCHBody = await request.json();

    const validate = z
      .object({
        name: z
          .string({ required_error: "Judul pekerjaan tidak boleh kosong!" })
          .min(1, "Judul pekerjaan tidak boleh kosong!"),
      })
      .safeParse({ name });

    if (!validate.success)
      return APIResponse.respondWithBadRequest(
        validate.error.errors.map((it) => ({
          path: it.path[0] as string,
          message: it.message,
        }))
      );

    // verifikasi authentication token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();
    const { userId } = authorization;

    // update profile
    const query = database
      .updateTable("users")
      .set({ name, gender })
      .where("id", "=", userId)
      .returning(["id"]);

    const result = await query.executeTakeFirstOrThrow();

    return APIResponse.respondWithSuccess<PATCHResponse>({
      id: result.id,
    });
    //
  } catch (e) {
    return APIResponse.respondWithServerError();
  }
};
