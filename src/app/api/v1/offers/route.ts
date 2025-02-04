import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { sql } from "kysely";
import { NextRequest } from "next/server";
import { z } from "zod";
interface Offer {
  id: string;
  title: string;
  description: string;
  type: string; // "antar-jemput" | "jasa-titip" | etc
  pickup_area: string; //  untuk antar-jemput: area penjemputan, untuk jasa-titip: area belanja
  destination_area: string; //  untuk antar-jemput: area tujuan, untuk jasa-titip: area pengantaran
  available_until: Date;
  price: number;
  offer_status?: string;
  freelancer_name: string;
  max_participants: number;
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

    // Hitung total data
    const totalCount = await database
      .selectFrom("offers")
      .select(sql<number>`count(*)`.as("count"))
      .executeTakeFirst();

    // Ambil data dengan pagination
    const offers = await database
      .selectFrom("offers as so")
      .innerJoin("users as u", "u.id", "so.freelancer")
      .select([
        "so.id",
        "so.title",
        "so.description",
        "so.type",
        "so.available_until",
        "so.price",
        "so.destination_area",
        "so.pickup_area",
        "so.offer_status",
        "so.max_participants",
        "u.name as freelancer_name",
        sql<string>`so."xata.createdAt"`.as("created_at"),
        sql<string>`so."xata.updatedAt"`.as("updated_at"),
      ])
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy("created_at", "desc")
      .execute();

    return APIResponse.respondWithSuccess<GETResponse>({
      offers: offers.map((it) => ({
        ...it,
        freelancer: {
          name: it.freelancer_name,
        },
      })),
      page_info: {
        count: offers.length,
        page: page,
        total_pages: Math.ceil((totalCount?.count || 0) / limit),
      },
    });
  } catch (e) {
    console.error("GET Error:", e);
    return APIResponse.respondWithServerError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();

    const createOfferSchema = z.object({
      title: z
        .string({ required_error: "Judul tidak boleh kosong!" })
        .min(1, "Judul tidak boleh kosong!"),
      description: z
        .string({ required_error: "Deskripsi tidak boleh kosong!" })
        .min(1, "Deskripsi tidak boleh kosong!"),
      type: z.enum(["antar-jemput", "jasa-titip"], {
        errorMap: () => ({ message: "Tipe offer tidak valid" }),
      }),
      available_until: z
        .string({
          required_error: "Waktu untuk penawaran tidak boleh kosong!",
        })
        .datetime({ message: "Format tanggal tidak valid" }),
      price: z
        .number({ required_error: "Biaya tidak boleh kosong!" })
        .positive("Biaya harus lebih dari 0"),
      pickup_area: z.string({
        required_error: "Area jemput tidak boleh kosong!",
      }),
      destination_area: z.string({
        required_error: "Area tujuan tidak boleh kosong!",
      }),
      max_participants: z
        .number()
        .int()
        .positive("Jumlah peserta harus lebih dari 0"),
    });

    const data = createOfferSchema.safeParse(json);

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

    const result = await database
      .insertInto("offers")
      .values({
        ...json,
        freelancer: authorization.userId,
        offer_status: "available",
        expired_at: null,
      })
      // .returningAll()
      .returning("id")
      .executeTakeFirst();

    if (!result) return APIResponse.respondWithServerError();

    return APIResponse.respondWithSuccess({
      success: true,
      id: result.id,
    });
  } catch (e) {
    return APIResponse.respondWithServerError();
  }
}
