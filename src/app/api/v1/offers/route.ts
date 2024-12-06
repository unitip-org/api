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
