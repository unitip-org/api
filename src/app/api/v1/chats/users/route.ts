import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { sql } from "kysely";
import { NextRequest } from "next/server";

interface Message {
  id: "string";
  from_user_id: "string";
  to_user_id: "string";
  message: "string";
  is_deleted: boolean;
  created_at: "string";
  updated_at: "string";
}

interface GETResponse {
  messages: Message[];
}
export async function GET(request: NextRequest) {
  try {
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();
    const { userId } = authorization;

    const query = database
      .selectFrom("chat_messages as cm")
      .select([
        "cm.id",
        "cm.from as from_user_id",
        "cm.to as to_user_id",
        "cm.message",
        "cm.is_deleted",
      ])
      .select(sql<string>`cm."xata.createdAt"`.as("created_at"))
      .select(sql<string>`cm."xata.updatedAt"`.as("updated_at"))
      .where((qb) =>
        qb("cm.from", "=", userId as any).or("cm.to", "=", userId as any)
      )
      .orderBy("created_at", "desc");
    const result = await query.execute();

    return APIResponse.respondWithSuccess<GETResponse>({
      messages: result as any,
    });
  } catch (e) {
    return APIResponse.respondWithServerError();
  }
}
