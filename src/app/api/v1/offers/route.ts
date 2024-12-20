import { database } from "@/lib/database";
import { sql } from "kysely";
import { NextRequest } from "next/server";
import { z } from "zod";

/**
 * @swagger
 * /api/v1/offers:
 *   get:
 *     tags:
 *       - offers
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         default: 10
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 offers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                       creator_name:
 *                         type: string
 *                 page:
 *                   type: integer
 *                 total_pages:
 *                   type: integer
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                       path:
 *                         type: string
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "10");

    const data = z
      .object({
        page: z.number().min(1, "Page harus lebih dari 0"),
        limit: z.number().min(1, "Limit harus lebih dari 0"),
      })
      .safeParse({ page, limit });
    if (!data.success)
      return Response.json(
        {
          errors: data.error.errors.map(({ message, path }) => ({
            message,
            path: path[0],
          })),
        },
        { status: 400 }
      );

    const query = database
      .selectFrom("offers")
      .innerJoin("users", "users.id", "offers.creator")
      .select([
        "offers.id",
        "offers.title",
        "offers.description",
        "users.name as creator_name",
      ])
      .select(sql<Date>`offers."xata.createdAt"`.as("created_at"))
      .offset((page - 1) * limit)
      .orderBy("created_at", "desc")
      .limit(limit);
    const offers = await query.execute();

    const totalOffersQuery = database
      .selectFrom("offers")
      .select(sql<number>`COUNT(*)`.as("total"));
    const totalOffers = await totalOffersQuery.executeTakeFirst();

    return Response.json({
      offers,
      page,
      total_pages: Math.ceil((totalOffers?.total ?? 0) / limit),
    });
  } catch (e) {
    return Response.json(
      { message: "Terjadi kesalahan tak terduga pada server!" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/v1/offers:
 *   post:
 *     tags:
 *       - offers
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               fee:
 *                 type: number
 *               location:
 *                 type: string
 *               creator_id:
 *                 type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                       path:
 *                         type: string
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const { title, description, fee, location, creator_id } = json;

    const data = z
      .object({
        title: z
          .string({ required_error: "Judul penawaran tidak boleh kosong!" })
          .min(1, "Judul penawaran tidak boleh kosong!"),
        description: z.string().optional(),
        fee: z
          .number({ required_error: "Biaya penawaran tidak boleh kosong!" })
          .min(0, "Biaya penawaran tidak boleh negatif!"),
        location: z
          .string({ required_error: "Lokasi penawaran tidak boleh kosong!" })
          .min(1, "Lokasi penawaran tidak boleh kosong!"),
        creator_id: z
          .string({ required_error: "Id kreator tidak boleh kosong!" })
          .min(1, "Id kreator tidak boleh kosong!"),
      })
      .safeParse({ title, description, fee, location, creator_id });
    if (!data.success)
      return Response.json(
        {
          errors: data.error.errors.map(({ message, path }) => ({
            message,
            path: path[0],
          })),
        },
        { status: 400 }
      );

    const query = database.insertInto("offers").values({
      title,
      description: description ?? "",
      fee,
      location,
      creator: creator_id,
    } as any);
    const result = await query.execute();

    if (result.length > 0)
      return Response.json({ message: "Berhasil membuat penawaran!" });
    else throw new Error("Gagal membuat penawaran!");
  } catch (e) {
    return Response.json(
      { message: "Terjadi kesalahan tak terduga pada server!" },
      { status: 500 }
    );
  }
}
