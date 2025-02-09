import { verifyBearerToken } from "@/lib/bearer-token";
import { database, xata } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { sql } from "kysely";
import { NextRequest } from "next/server";
import { z } from "zod";
import { ApplicantStatus, OfferStatus } from "@/constants/constants";

interface POSTResponse {
  success: boolean;
  id: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { offer_id: string } }
) {
  try {
    const json = await request.json();
    const {
      note,
      final_price,
      destination_location,
      pickup_location,
      pickup_latitude,
      pickup_longitude,
      destination_latitude,
      destination_longitude,
    } = json;
    const { offer_id } = params;

    const schema = z.object({
      note: z.string({
        required_error: "Catatan untuk pemesanan tidak boleh kosong!",
      }),
      final_price: z.number({
        required_error: "Harga akhir tidak boleh kosong!",
      }),
      destination_location: z.string({
        required_error: "Lokasi tujuan tidak boleh kosong!",
      }),
      pickup_location: z.string({
        required_error: "Lokasi penjemputan tidak boleh kosong!",
      }),
      pickup_latitude: z.number({
        required_error: "Latitude lokasi penjemputan tidak boleh kosong!",
      }),
      pickup_longitude: z.number({
        required_error: "Longitude lokasi penjemputan tidak boleh kosong!",
      }),
      destination_latitude: z.number({
        required_error: "Latitude lokasi tujuan tidak boleh kosong!",
      }),
      destination_longitude: z.number({
        required_error: "Longitude lokasi tujuan tidak boleh kosong!",
      }),
      offer_id: z.string().min(1, "Offer ID tidak boleh kosong!"),
    });

    const data = schema.safeParse({
      note,
      final_price,
      destination_location,
      pickup_location,
      pickup_latitude,
      pickup_longitude,
      destination_latitude,
      destination_longitude,
      offer_id,
    });

    if (!data.success) {
      return APIResponse.respondWithBadRequest(
        data.error.errors.map((it) => ({
          message: it.message,
          path: it.path[0] as string,
        }))
      );
    }

    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();

    // verifikasi role user
    if (authorization.role !== "customer") {
      return APIResponse.respondWithForbidden(
        "Anda tidak memiliki akses untuk melakukan aksi ini!"
      );
    }

    const offer = await database
      .selectFrom("offers")
      .select(["id", "offer_status", "max_participants"])
      .where("id", "=", offer_id)
      .where("offer_status", "=", "available")
      .where("available_until", ">", sql<Date>`NOW()`)
      .executeTakeFirst();

    if (!offer) {
      return APIResponse.respondWithConflict(
        "Offer tidak tersedia atau sudah berakhir!"
      );
    }

    // Hitung jumlah aplikasi yang sudah ada
    const applicantsCount = await database
      .selectFrom("offer_applicants")
      .where("offer", "=", offer_id as any)
      .select(sql`count(*)`.as("count"))
      .executeTakeFirst();

    const currentParticipants = Number(applicantsCount?.count || 0);

    // Cek apakah masih ada slot tersedia
    if (currentParticipants >= offer.max_participants) {
      return APIResponse.respondWithConflict(
        "Maaf, kuota peserta untuk offer ini sudah penuh!"
      );
    }

    const existingApplication = await database
      .selectFrom("offer_applicants")
      .select("id")
      .where("customer", "=", authorization.userId as any)
      .where("offer", "=", offer_id as any)
      .executeTakeFirst();

    if (existingApplication) {
      return APIResponse.respondWithConflict(
        "Anda sudah mengajukan aplikasi untuk offer ini!"
      );
    }

    const result = await xata.transactions.run([
      // Insert aplikasi baru
      {
        insert: {
          createOnly: true,
          table: "offer_applicants",
          record: {
            applicant_status: ApplicantStatus.PENDING,
            note,
            final_price,
            pickup_location,
            destination_location, 
            pickup_latitude,
            pickup_longitude,
            destination_latitude,
            destination_longitude,
            customer: authorization.userId,
            offer: offer_id
          }
        }
      },
    
      // Update offer status jika mencapai max participants
      ...(currentParticipants + 1 >= offer.max_participants ? [{
        update: {
          table: "offers" as const,
          id: offer_id,
          fields: {
            offer_status: OfferStatus.CLOSED
          }
        }
      }] : [])
    ]);
    

    if (!result.results?.[0]?.id) {
      return APIResponse.respondWithServerError();
    }
    
    // Ambil ID dari hasil insert aplikasi
    const newApplicationId = result.results[0].id;
    
    return APIResponse.respondWithSuccess<POSTResponse>({
      success: true,
      id: newApplicationId
    });
  } catch (e) {
    console.error(e);
    return APIResponse.respondWithServerError();
  }
}

interface DELETEResponse {
  success: Boolean;
  id: string;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { offer_id: string } }
) {
  try {
    // verifikasi request user
    const { offer_id: offerId } = params;
    const validate = z
      .object({
        offerId: z
          .string({ required_error: "ID penawaran tidak boleh kosong!" })
          .min(1, "ID penawaran tidak boleh kosong!"),
      })
      .safeParse({ offerId });
    if (!validate.success)
      return APIResponse.respondWithBadRequest(
        validate.error.errors.map((it) => ({
          path: it.path[0] as string,
          message: it.message,
        }))
      );

    // verifikasi bearer token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();
    const { userId, role } = authorization;

    // verifikasi role user
    if (role !== "customer")
      return APIResponse.respondWithForbidden(
        "Anda tidak memiliki akses untuk melakukan aksi ini!"
      );

    // Jenis Offer saat ini
    const offerType = await database
      .selectFrom("offers")
      .where("id", "=", offerId as any)
      .select("type")
      .executeTakeFirst();

    // Kondisi jika anjem maka langsung berubah ke available
    if (offerType?.type === "antar-jemput") {
      const updateResult = await database
        .updateTable("offers")
        .set({
          offer_status: "available",
        })
        .where("id", "=", offerId)
        .executeTakeFirst();

      if (!updateResult) {
        return APIResponse.respondWithConflict("Gagal membatalkan aplikasi.");
      }
    }
    // cancel offer aplicant, atau cancel dari customer
    const result = await database
      .deleteFrom("offer_applicants")
      .where("customer", "=", userId as any)
      .where("offer", "=", offerId as any)
      .returning("id")
      .executeTakeFirstOrThrow();

    if (!result) {
      return APIResponse.respondWithConflict(
        "Tidak ada data yang dihapus karena tidak ada aplikasi yang ditemukan."
      );
    }

    await database
      .updateTable("offers")
      .set({
        offer_status: "on_progress",
      })
      .where("id", "=", offerId)
      .execute();

    return APIResponse.respondWithSuccess<DELETEResponse>({
      success: true,
      id: result.id,
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
}

interface PATCHResponse {
  success: boolean;
  id: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { offer_id: string } }
) {
  try {
    // verifikasi request user
    const { offer_id: offerId } = params;
    const validate = z
      .object({
        offerId: z
          .string({ required_error: "ID penawaran tidak boleh kosong!" })
          .min(1, "ID penawaran tidak boleh kosong!"),
      })
      .safeParse({ offerId });

    if (!validate.success)
      return APIResponse.respondWithBadRequest(
        validate.error.errors.map((it) => ({
          path: it.path[0] as string,
          message: it.message,
        }))
      );

    // verifikasi bearer token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();
    const { userId, role } = authorization;

    const json = await request.json();
    const {
      note,
      final_price,
      destination_location,
      pickup_location,
      pickup_latitude,
      pickup_longitude,
      destination_latitude,
      destination_longitude,
    } = json;
    const { offer_id } = params;

    const schema = z.object({
      note: z.string({
        required_error: "Catatan untuk pemesanan tidak boleh kosong!",
      }),
      final_price: z.number({
        required_error: "Harga akhir tidak boleh kosong!",
      }),
      destination_location: z.string({
        required_error: "Lokasi tujuan tidak boleh kosong!",
      }),
      pickup_location: z.string({
        required_error: "Lokasi penjemputan tidak boleh kosong!",
      }),
      pickup_latitude: z.number({
        required_error: "Latitude lokasi penjemputan tidak boleh kosong!",
      }),
      pickup_longitude: z.number({
        required_error: "Longitude lokasi penjemputan tidak boleh kosong!",
      }),
      destination_latitude: z.number({
        required_error: "Latitude lokasi tujuan tidak boleh kosong!",
      }),
      destination_longitude: z.number({
        required_error: "Longitude lokasi tujuan tidak boleh kosong!",
      }),
      offer_id: z.string().min(1, "Offer ID tidak boleh kosong!"),
    });

    const data = schema.safeParse({
      note,
      final_price,
      destination_location,
      pickup_location,
      pickup_latitude,
      pickup_longitude,
      destination_latitude,
      destination_longitude,
      offer_id,
    });

    if (!data.success) {
      return APIResponse.respondWithBadRequest(
        data.error.errors.map((it) => ({
          message: it.message,
          path: it.path[0] as string,
        }))
      );
    }

    // verifikasi role user
    if (authorization.role !== "customer") {
      return APIResponse.respondWithForbidden(
        "Anda tidak memiliki akses untuk melakukan aksi ini!"
      );
    }
    // Fetch the existing offer application from the database
    const existingApplication = await database
      .selectFrom("offer_applicants")
      .where("offer", "=", offerId as any)
      .where("customer", "=", userId as any)
      .select([
        "id",
        "note",
        "final_price",
        "destination_location",
        "pickup_location",
        "pickup_latitude",
        "pickup_longitude",
        "destination_latitude",
        "destination_longitude",
      ])
      .executeTakeFirst();
    if (!existingApplication) {
      return APIResponse.respondWithNotFound("Aplikasi tidak ditemukan.");
    }

    // Update the offer application with the new data
    const result = await database
      .updateTable("offer_applicants")
      .set({
        note,
        final_price,
        destination_location,
        pickup_location,
        pickup_latitude,
        pickup_longitude,
        destination_latitude,
        destination_longitude,
      })
      .where("id", "=", existingApplication.id)
      .execute();

    if (!result) {
      return APIResponse.respondWithConflict("Gagal memperbarui aplikasi.");
    }
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
}
