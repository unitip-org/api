import { verifyBearerToken } from "@/lib/bearer-token";
import { xata } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";
import { FetcherError } from "@xata.io/client";
import { NextRequest } from "next/server";
import { v4 } from "uuid";
import { z } from "zod";

interface POSTBody {
  members: string[];
}
interface POSTResponse {
  id: string;
}
export const POST = async (request: NextRequest) => {
  try {
    // validasi request dari user
    const { members }: POSTBody = await request.json();
    const validate = z
      .object({
        members: z
          .array(
            z
              .string({ required_error: "ID member tidak boleh kosong!" })
              .min(1, "ID member tidak boleh kosong!"),
            { required_error: "Member tidak boleh kosong!" }
          )
          .min(1, "Member tidak boleh kosong!"),
      })
      .safeParse({ members });
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

    // membuat room baru, serta menambahkan member ke dalam room tersebut
    const newRoomUuid = v4();
    const transactionResult = await xata.transactions.run([
      // membuat room baru
      {
        insert: {
          table: "chat_rooms",
          createOnly: true,
          record: {
            id: newRoomUuid,
          },
        },
      },

      // menambahkan member ke dalam room tersebut
      ...(members.map((it) => ({
        insert: {
          table: "chat_room_members",
          createOnly: true,
          record: {
            id: `${newRoomUuid}_${it}`,
            room: newRoomUuid,
            user: it,
          },
        },
      })) as any),
    ]);

    // validasi hasil transaksi, jika terdapat error maka kembalikan response error
    if (transactionResult.results.length !== members.length + 1)
      return APIResponse.respondWithServerError();

    // kembalikan response sukses
    return APIResponse.respondWithSuccess<POSTResponse>({
      id: transactionResult.results[0].id,
    });
  } catch (e) {
    console.log(e);

    // handle error ketika terdapat id member yang tidak ditemukan
    if (e instanceof FetcherError) {
      if (
        e.errors?.some(
          (it) => it.message?.indexOf("unknown record ID referenced") !== -1
        )
      )
        return APIResponse.respondWithNotFound("ID member tidak ditemukan!");
    }

    // handle error lainnya
    return APIResponse.respondWithServerError();
  }
};

// GET endpoint untuk cek room berdasarkan members
export const GET = async (request: NextRequest) => {
  try {
    const members = request.nextUrl.searchParams.get("members")?.split(",");
    if (!members)
      return APIResponse.respondWithBadRequest([
        {
          path: "members",
          message: "Members tidak boleh kosong!",
        },
      ]);

    // verifikasi bearer token
    const authorization = await verifyBearerToken(request);
    if (!authorization) return APIResponse.respondWithUnauthorized();

    // Dapatkan semua room_id yang memiliki member yang dimaksud
    const roomMembers = await xata.db.chat_room_members
      .select(["room.id"])
      .filter({
        "user.id": { $any: members },
      })
      .getMany();

    // Hitung frekuensi setiap room_id
    const roomFrequency = roomMembers.reduce((acc, curr) => {
      const roomId = curr.room?.id;
      if (roomId) {
        acc[roomId] = (acc[roomId] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Cari room yang memiliki kedua member (frekuensi = jumlah members yang dicari)
    const matchingRoomId = Object.entries(roomFrequency).find(
      ([_, count]) => count === members.length
    )?.[0];

    return APIResponse.respondWithSuccess({
      room_id: matchingRoomId || null,
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
};
