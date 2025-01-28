import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { sql } from "kysely";
import { NextRequest } from "next/server";

interface Offer {
  id: string;
  title: string;
  description: string;
  type: string;
  pickup_location?: string; // optional untuk tipe jasa-titip
  delivery_area?: string; // optional untuk tipe antar-jemput
  pickup_area?: string; // optional untuk tipe antar-jemput
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

    const [singleOffers, multiOffers, singleCount, multiCount] =
      await Promise.all([
        database
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
          ])
          .execute(),

        database
          .selectFrom("multi_offers as mo")
          .innerJoin("users as u", "u.id", "mo.freelancer")
          .select([
            "mo.id",
            "mo.title",
            "mo.description",
            sql<string>`'jasa-titip'`.as("type"),
            "mo.available_until",
            "mo.price",
            "mo.delivery_area",
            "mo.pickup_area",
            "mo.offer_status",
            "u.name as freelancer_name",
            sql<string>`mo."xata.createdAt"`.as("created_at"),
            sql<string>`mo."xata.updatedAt"`.as("updated_at"),
          ])
          .execute(),

        database
          .selectFrom("single_offers")
          .select(sql<number>`count(*)`.as("count"))
          .executeTakeFirst(),

        database
          .selectFrom("multi_offers")
          .select(sql<number>`count(*)`.as("count"))
          .executeTakeFirst(),
      ]);

    // Combine and sort all offers
    const allOffers = [...singleOffers, ...multiOffers].sort((a, b) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

    // Apply pagination
    const paginatedOffers = allOffers.slice(
      (page - 1) * limit,
      (page - 1) * limit + limit
    );

    const totalCount = (singleCount?.count || 0) + (multiCount?.count || 0);

    return APIResponse.respondWithSuccess<GETResponse>({
      offers: paginatedOffers.map((it) => ({
        ...it,
        freelancer: {
          name: it.freelancer_name,
        },
      })),
      page_info: {
        count: paginatedOffers.length,
        page: page,
        total_pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (e) {
    console.error("GET Error:", e);
    return APIResponse.respondWithServerError();
  }
}
