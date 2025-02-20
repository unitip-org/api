import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { NextRequest } from "next/server";
import { v4 } from "uuid";
import { z } from "zod";

interface POSTBody {
  parent: string;
  content: string;
}
interface POSTResponse {
  id: string;
}
export const POST = async (request: NextRequest) => {
  try {
    // validasi request dari user
    const { parent, content }: POSTBody = await request.json();
    const validate = z
      .object({
        parent: z.string().optional(),
        content: z
          .string({ required_error: "Konten aktivitas tidak boleh kosong!" })
          .min(1, "Konten aktivitas tidak boleh kosong!"),
      })
      .safeParse({ parent, content });
    if (!validate.success)
      return APIResponse.respondWithBadRequest(
        validate.error.errors.map((it) => ({
          path: it.path[0] as string,
          message: it.message,
        }))
      );

    // validasi bearer token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();
    const { userId } = authorization;

    // query untuk membuat activity baru
    const query = database
      .insertInto("activities")
      .values({
        id: v4(),
        parent,
        content,
      } as any)
      .returning("id");
    const result = await query.executeTakeFirstOrThrow();

    return APIResponse.respondWithSuccess<POSTResponse>({
      id: result.id,
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
};
