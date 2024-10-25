"use server";

import { database } from "@/lib/database";

export const getAllCustomers = async () => {
  try {
    const query = database
      .selectFrom("users as u")
      .select(["u.id", "u.name", "u.email"])
      .orderBy("u.name");
    const result = await query.execute();

    return result;
  } catch (e) {
    throw e;
  }
};
