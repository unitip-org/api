import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { hash } from "bcrypt";
import { NextRequest } from "next/server";
import { z } from "zod";

interface PATCHBody {
  password: string;
}

interface PATCHResponse {
  id: string;
}

export const PATCH = async (request: NextRequest) => {
  try {
    const { password }: PATCHBody = await request.json();

    const validate = z
      .object({
        password: z
          .string({
            required_error: "Kata sandi minimal terdiri dari 6 karakter!",
          })
          .min(6, "Kata sandi minimal terdiri dari 6 karakter!"),
      })
      .safeParse({ password });

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

    // query update password
    const hashedPassword = await hash(password, 12);

    const query = database
      .updateTable("users")
      .set({ password: hashedPassword })
      .where("id", "=", userId)
      .returning(["id"]);

    const result = await query.executeTakeFirstOrThrow();

    return APIResponse.respondWithSuccess<PATCHResponse>({
      id: result.id,
    });
  } catch (e) {
    return APIResponse.respondWithServerError;
  }
};
