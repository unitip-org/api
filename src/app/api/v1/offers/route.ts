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

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const {
      title,
      description,
      type,
      available_until,
      price,
      location,
      delivery_area,
    } = json;
    const data = z
      .object({
        title: z
          .string({ required_error: "Judul tidak boleh kosong!" })
          .min(1, "Judul tidak boleh kosong!"),
        description: z.string().optional(),
        type: z.enum(["antar-jemput", "jasa-titip"]),
        available_until: z
          .string({
            required_error: "Waktu untuk penawaran tidak boleh kosong!",
          })
          .min(1, "Waktu untuk penawaran tidak boleh kosong!"),
        price: z
          .number({ required_error: "Biaya tidak boleh kosong!" })
          .min(0, "Biaya tidak boleh negatif!"),
        location: z
          .string({ required_error: "Lokasi tidak boleh kosong!" })
          .min(1, "Lokasi tidak boleh kosong!"),
        delivery_area: z.string().optional(),
      })
      .safeParse({
        title,
        description,
        type,
        available_until,
        price,
        location,
        delivery_area,
      });

    if (!data.success)
      return APIResponse.respondWithBadRequest(
        data.error.errors.map((it) => ({
          message: it.message,
          path: it.path[0] as string,
        }))
      );
    // validasi auth token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();

    // validasi role
    if (authorization.role == "customer")
      return APIResponse.respondWithForbidden(
        "Anda tidak memiliki akses untuk membuat offer!"
      );
    console.log("Authorization:", authorization);

    if (type === "jasa-titip") {
      /**
       * jasa-titip adalah service single offer dan hanya dapat dibuat oleh role
       *selain customer
       */
      console.log("Input Data:", {
        title,
        description,
        type,
        available_until,
        price,
        location,
        delivery_area,
        freelancer: authorization.userId,
      });

      const query = database
        .insertInto("single_offers")
        .values({
          title,
          description,
          type,
          available_until,
          price,
          location,
          delivery_area,
          freelancer: authorization.userId,
          status: "available",
          payment_status: "unpaid",
        } as any)
        .returning("id");

      console.log("Executing Query:", query.compile());

      const result = await query.executeTakeFirst();
      console.log("Query Result:", result);

      if (!result) return APIResponse.respondWithServerError();

      return APIResponse.respondWithSuccess<POSTResponse>({
        success: true,
        id: result.id,
      });
    } else if (type === "antar-jemput") {
      const query = database
        .insertInto("multi_offers")
        .values({
          title,
          description,
          price,
          available_until,
          location,
          freelancer: authorization.userId,
          status: "available",
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

interface OfferFreelancer {
  name: string;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  type: string;
  available_until: string;
  price: number;
  location: string;
  delivery_area?: string;
  freelancer: OfferFreelancer;
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

interface OfferResult {
  id: string;
  title: string;
  description: string;
  type: string;
  available_until: string;
  price: number;
  location: string;
  delivery_area: string;
  created_at: string;
  updated_at: string;
  freelancer_name: string;
}

export async function GET(request: NextRequest) {
  try {
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "10");
    const type = searchParams.get("type") || "all"; // all, jasa-titip, antar-jemput
    let offersQuery;
    let countQuery;
    if (type === "single" || type === "all") {
      // Query untuk single offers
      offersQuery = database
        .selectFrom("single_offers as so")
        .innerJoin("users as u", "u.id", "so.freelancer")
        .select([
          "so.id",
          "so.title",
          "so.description",
          "so.type",
          "so.available_until",
          "so.price",
          "so.location",
          "so.delivery_area",
          "u.name as freelancer_name",
        ])
        .select(sql<string>`so."xata.createdAt"`.as("created_at"))
        .select(sql<string>`so."xata.updatedAt"`.as("updated_at"));
    }
    if (type === "multi" || type === "all") {
      const multiQuery = database
        .selectFrom("multi_offers as mo")
        .innerJoin("users as u", "u.id", "mo.freelancer")
        .select([
          "mo.id",
          "mo.title",
          "mo.description",
          sql<string>`'antar-jemput'`.as("type"),
          "mo.available_until",
          "mo.price",
          "mo.location",
          sql<string>`''`.as("delivery_area"),
          "u.name as freelancer_name",
        ])
        .select(sql<string>`mo."xata.createdAt"`.as("created_at"))
        .select(sql<string>`mo."xata.updatedAt"`.as("updated_at"));

      offersQuery =
        type === "all" ? (offersQuery as any).union(multiQuery) : multiQuery;
      }
    offersQuery = (offersQuery as any)
      .offset((page - 1) * limit)
      .orderBy("created_at", "desc")
      .limit(limit);
    const offersResult = await offersQuery.execute();
    // Count que
    if (type === "single") {
      countQuery = database
        .selectFrom("single_offers")
        .select(sql<number>`count(*)`.as("count"));
    } else if (type === "multi") {
      countQuery = database
        .selectFrom("multi_offers")
        .select(sql<number>`count(*)`.as("count"));
    } else {
      countQuery = database
        .selectFrom(
          database
            .selectFrom("single_offers")
            .select(sql<number>`1`.as("count"))
            .union(
              database
                .selectFrom("multi_offers")
                .select(sql<number>`1`.as("count"))
            )
            .as("combined")
        )
        .select(sql<number>`count(*)`.as("count"));
    }
    const resultCount = await countQuery.executeTakeFirst();
    return APIResponse.respondWithSuccess<GETResponse>({
      offers: offersResult.map(
        (it: OfferResult) =>
          <Offer>{
            id: it.id,
            title: it.title,
            description: it.description,
            type: it.type,
            available_until: it.available_until,
            price: it.price,
            location: it.location,
            delivery_area: it.delivery_area,
            created_at: it.created_at,
            updated_at: it.updated_at,
            freelancer: <OfferFreelancer>{
              name: it.freelancer_name,
            },
          }
      ),
      page_info: {
        count: offersResult.length,
        page: page,
        total_pages: Math.ceil((resultCount?.count ?? 0) / limit),
      },
    });
  } catch (e) {
    return APIResponse.respondWithServerError();
  }
}
