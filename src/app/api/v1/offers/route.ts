import { Order } from "@/constants/order";
import { Role } from "@/constants/role";
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

interface BaseOfferInput {
  title: string;
  description: string;
  type: "antar-jemput" | "jasa-titip";
  available_until: string;
  price: number;
}

interface SingleOfferInput extends BaseOfferInput {
  type: "antar-jemput";
  delivery_area: string; // area antar jemput
  pickup_area: string; // area penjemputan
}

interface MultiOfferInput extends BaseOfferInput {
  type: "jasa-titip";
  pickup_location: string; // lokasi membeli barang
  delivery_area: string; // area pengantaran
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const {
      title,
      description,
      type,
      available_until,
      price,
      pickup_location,
      delivery_area,
      pickup_area,
    } = json;

    const baseSchema = {
      title: z
        .string({ required_error: "Judul tidak boleh kosong!" })
        .min(1, "Judul tidak boleh kosong!"),
      description: z
        .string({ required_error: "Deskripsi tidak boleh kosong!" })
        .min(1, "Deskripsi tidak boleh kosong!"),
      type: z.enum(["antar-jemput", "jasa-titip"]),
      available_until: z
        .string({
          required_error: "Waktu untuk penawaran tidak boleh kosong!",
        })
        .min(1, "Waktu untuk penawaran tidak boleh kosong!"),
      price: z
        .number({ required_error: "Biaya tidak boleh kosong!" })
        .min(0, "Biaya tidak boleh negatif!"),
    };

    // Schema berbeda untuk masing-masing tipe
    const schema =
      type === "antar-jemput"
        ? z.object({
            ...baseSchema,
            delivery_area: z.string({
              required_error: "Area antar tidak boleh kosong!",
            }),
            pickup_area: z.string({
              required_error: "Area jemput tidak boleh kosong!",
            }),
          })
        : z.object({
            ...baseSchema,
            pickup_location: z.string({
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

    if (type === "antar-jemput") {
      const query = database
        .insertInto("single_offers")
        .values({
          title,
          description,
          type,
          available_until,
          price,
          delivery_area, // area antar jemput
          pickup_area, // area penjemputan
          freelancer: authorization.userId,
          offer_status: "available",
          expired_at: null,
        } as any)
        .returning("id");

      const result = await query.executeTakeFirst();
      if (!result) return APIResponse.respondWithServerError();

      return APIResponse.respondWithSuccess<POSTResponse>({
        success: true,
        id: result.id,
      });
    } else if (type === "jasa-titip") {
      const query = database
        .insertInto("multi_offers")
        .values({
          title,
          description,
          price,
          available_until,
          freelancer: authorization.userId,
          status: "available",
          pickup_location, // lokasi pembelian barang
          delivery_area, // area pengantaran
        } as any)
        .returning("id");

      const result = await query.executeTakeFirst();
      if (!result) return APIResponse.respondWithServerError();

      return APIResponse.respondWithSuccess<POSTResponse>({
        success: true,
        id: result.id,
      });
    }

    return APIResponse.respondWithServerError();
  } catch (e) {
    return APIResponse.respondWithServerError();
  }
}

// interface OfferFreelancer {
//   name: string;
// }

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
  status?: string;
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
    const type = searchParams.get("type") || "all";

    if (!["all", "single", "multi"].includes(type)) {
      return APIResponse.respondWithBadRequest([
        {
          message: "Invalid type parameter",
          path: "type",
        },
      ]);
    }

    let offersResult: Offer[] = [];
    let totalCount = 0;

    if (type === "single" || type === "all") {
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
      // .where("so.offer_status", "=", "available");
      // .where("so.offer_status", "=", "waiting");

      const singleCount = await database
        .selectFrom("single_offers")
        // .where("offer_status", "=", "available")
        .select(sql<number>`count(*)`.as("count"))
        .executeTakeFirst();

      if (type === "single") {
        offersResult = await singleQuery
          .orderBy(sql`so."xata.createdAt"`, "desc")
          .offset((page - 1) * limit)
          .limit(limit)
          .execute();
        totalCount = singleCount?.count || 0;
      } else {
        const singleOffers = await singleQuery.execute();
        offersResult = [...singleOffers];
        totalCount = singleCount?.count || 0;
      }
    }

    if (type === "multi" || type === "all") {
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
          "mo.pickup_location",
          "mo.delivery_area",
          "mo.status",
          "u.name as freelancer_name",
          sql<string>`mo."xata.createdAt"`.as("created_at"),
          sql<string>`mo."xata.updatedAt"`.as("updated_at"),
        ]);
      // .where("mo.status", "=", "available");
      // .where("mo.status", "=", "waiting");

      const multiCount = await database
        .selectFrom("multi_offers")
        // .where("status", "=", "available")
        .select(sql<number>`count(*)`.as("count"))
        .executeTakeFirst();

      if (type === "multi") {
        offersResult = await multiQuery
          .orderBy(sql`mo."xata.createdAt"`, "desc")
          .offset((page - 1) * limit)
          .limit(limit)
          .execute();
        totalCount = multiCount?.count || 0;
      } else {
        const multiOffers = await multiQuery.execute();
        offersResult = [...offersResult, ...multiOffers];
        totalCount += multiCount?.count || 0;
      }
    }

    // For type "all", apply sorting and pagination after combining results
    if (type === "all") {
      offersResult.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });

      offersResult = offersResult.slice(
        (page - 1) * limit,
        (page - 1) * limit + limit
      );
    }

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
        total_pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (e) {
    console.error("GET Error:", e);
    return APIResponse.respondWithServerError();
  }
}
