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

interface MultiOfferInput {
  title: string;
  description: string;
  type: "jasa-titip";
  available_until: string;
  price: number;
  pickup_area: string; // lokasi membeli barang
  delivery_area: string; // area pengantaran
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
      type: z.literal("jasa-titip"),
      available_until: z
        .string({
          required_error: "Waktu untuk penawaran tidak boleh kosong!",
        })
        .min(1, "Waktu untuk penawaran tidak boleh kosong!"),
      price: z
        .number({ required_error: "Biaya tidak boleh kosong!" })
        .min(0, "Biaya tidak boleh negatif!"),
      pickup_area: z.string({
        required_error: "Lokasi pembelian barang tidak boleh kosong!",
      }),
      delivery_area: z.string({
        required_error: "Area pengantaran tidak boleh kosong!",
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
      .insertInto("multi_offers")
      .values({
        ...json,
        freelancer: authorization.userId,
        offer_status: "available",
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
  pickup_area?: string; // lokasi membeli barang
  delivery_area?: string; // area antar jemput untuk singleoffer
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

    const multiQuery = database
      .selectFrom("multi_offers as mo")
      .innerJoin("users as u", "u.id", "mo.freelancer")
      .select([
        "mo.id",
        "mo.title",
        "mo.description",
        sql<string>`'jasa-titip'`.as("type"),
        "mo.available_until",
        "mo.price",
        "mo.pickup_area",
        "mo.delivery_area",
        "mo.offer_status",
        "u.name as freelancer_name",
        sql<string>`mo."xata.createdAt"`.as("created_at"),
        sql<string>`mo."xata.updatedAt"`.as("updated_at"),
      ]);

    const multiCount = await database
      .selectFrom("multi_offers")
      .select(sql<number>`count(*)`.as("count"))
      .executeTakeFirst();

    const offersResult = await multiQuery
      .orderBy(sql`mo."xata.createdAt"`, "desc")
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
        total_pages: Math.ceil(multiCount?.count || 0 / limit),
      },
    });
  } catch (e) {
    console.error("GET Error:", e);
    return APIResponse.respondWithServerError();
  }
}
