"use server";

import { database } from "@/lib/database";

export const getAllOffers = async () => {
  try {
    const query = database
      .selectFrom("driver_offers as do")
      .innerJoin("users as u", "u.id", "do.driverId")
      .select([
        "do.id",
        "do.title",
        "do.additionalNotes",
        "do.availableUntil",
        "do.fee",
        "do.location",
        "u.name as driver_name",
      ]);

    const result = await query.execute();
    return result;
  } catch (e) {
    throw e;
  }
};
