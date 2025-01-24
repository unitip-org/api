import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { sql } from "kysely";
import { NextRequest } from "next/server";
import { z } from "zod";

interface POSTResponse {
  success: boolean;
  id: string;
}

interface SingleOfferInput {
  title: string;
  description: string;
  type: "antar-jemput";
  available_until: string;
  price: number;
  delivery_area: string; // area antar jemput
  pickup_area: string; // area penjemputan
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();

    const schema = z.object({
      title: z
        .string({ required_error: "Judul tidak boleh kosong!" })
        .min(1, "Judul tidak boleh kosong!"),
      description: z
        .string({ required_error: "Deskripsi tidak boleh kosong!" })
        .min(1, "Deskripsi tidak boleh kosong!"),
      type: z.literal("antar-jemput"),
      available_until: z
        .string({
          required_error: "Waktu untuk penawaran tidak boleh kosong!",
        })
        .min(1, "Waktu untuk penawaran tidak boleh kosong!"),
      price: z
        .number({ required_error: "Biaya tidak boleh kosong!" })
        .min(0, "Biaya tidak boleh negatif!"),
      delivery_area: z.string({
        required_error: "Area antar tidak boleh kosong!",
      }),
      pickup_area: z.string({
        required_error: "Area jemput tidak boleh kosong!",
      }),
    });

    const data = schema.safeParse(json);

    if (!data.success)
      return APIResponse.respondWithBadRequest(
        data.error.errors.map((it) => ({
          message: it.message,
          path: it.path[0] as string,
        }))
      );

    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();

    if (authorization.role == "customer")
      return APIResponse.respondWithForbidden(
        "Anda tidak memiliki akses untuk membuat offer!"
      );

    const query = database
      .insertInto("single_offers")
      .values({
        ...json,
        freelancer: authorization.userId,
        offer_status: "available",
        expired_at: null,
      })
      .returning("id");

    const result = await query.executeTakeFirst();
    if (!result) return APIResponse.respondWithServerError();

    return APIResponse.respondWithSuccess<POSTResponse>({
      success: true,
      id: result.id,
    });
  } catch (e) {
    return APIResponse.respondWithServerError();
  }
}

interface Offer {
  id: string;
  title: string;
  description: string;
  type: string;
  delivery_area?: string; // area pengantaran untuk multioffer
  pickup_area?: string; // area penjemputan
  available_until: Date;
  price: number;
  offer_status?: string;
  freelancer_name: string;
  created_at: string;
  updated_at: string;
}

interface GETResponse {
  offers: Offer[];
  page_info: {
    count: number;
    page: number;
    total_pages: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const limit = Number(searchParams.get("limit") || "10");

    const singleQuery = database
      .selectFrom("single_offers as so")
      .innerJoin("users as u", "u.id", "so.freelancer")
      .select([
        "so.id",
        "so.title",
        "so.description",
        sql<string>`'antar-jemput'`.as("type"),
        "so.available_until",
        "so.price",
        "so.delivery_area",
        "so.pickup_area",
        "so.offer_status",
        "u.name as freelancer_name",
        sql<string>`so."xata.createdAt"`.as("created_at"),
        sql<string>`so."xata.updatedAt"`.as("updated_at"),
      ]);

    const singleCount = await database
      .selectFrom("single_offers")
      .select(sql<number>`count(*)`.as("count"))
      .executeTakeFirst();

    const offersResult = await singleQuery
      .orderBy(sql`so."xata.createdAt"`, "desc")
      .offset((page - 1) * limit)
      .limit(limit)
      .execute();

    return APIResponse.respondWithSuccess<GETResponse>({
      offers: offersResult.map((it) => ({
        ...it,
        freelancer: {
          name: it.freelancer_name,
        },
      })),
      page_info: {
        count: offersResult.length,
        page: page,
        total_pages: Math.ceil(singleCount?.count || 0 / limit),
      },
    });
  } catch (e) {
    console.error("GET Error:", e);
    return APIResponse.respondWithServerError();
  }
}
