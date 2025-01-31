// src\app\(customer-driver)\chats\actions.ts
"use server";

import { database } from "@/lib/database";
import { sql } from "kysely";

export const getAllChats = async (props: { authenticatedUserId: string }) => {
  try {
    // const query = database
    //   .selectFrom((qb) =>
    //     qb
    //       .selectFrom("chats as c")
    //       .innerJoin("users as u", "u.id", "c.from")
    //       .select(["c.from", "c.to", "c.message", "u.name", "u.email"])
    //       .select(sql<Date>`c."xata.createdAt"`.as("created_at"))
    //       .distinctOn(["c.from", "c.to"])
    //       .where((eb) =>
    //         eb("c.from", "=", props.authenticatedUserId as any).or(
    //           "c.to",
    //           "=",
    //           props.authenticatedUserId as any
    //         )
    //       )
    //       .as("chats")
    //   )
    //   .selectAll();
    // const query = database
    //   .selectFrom("chats as c")
    //   .innerJoin("users as u", "u.id", "c.from")
    //   .select(["c.from", "c.to", "c.message", "u.name", "u.email"])
    //   .select(sql<Date>`c."xata.createdAt"`.as("created_at"))
    //   .distinctOn(["c.from", "c.to"])
    //   .where((eb) =>
    //     eb("c.from", "=", props.authenticatedUserId as any).or(
    //       "c.to",
    //       "=",
    //       props.authenticatedUserId as any
    //     )
    //   )
    //   .orderBy("created_at", "desc");
    // console.log(query.compile());
    // const query = database
    //   .selectFrom("chats as c")
    //   .distinct()
    //   .select(["c.from", "c.to"])
    //   .where((eb) =>
    //     eb("c.to", "=", props.authenticatedUserId as any).or(
    //       "c.from",
    //       "=",
    //       props.authenticatedUserId as any
    //     )
    //   );
    // const result = await query.execute();
    // console.log(result);

    const query = database
      .selectFrom("chat_rooms as cr")
      .innerJoin("users as u", "u.id", "cr.to_user")
      .where("cr.from_user", "=", props.authenticatedUserId as any)
      .select([
        "cr.last_message",
        "cr.last_sent_user",
        "u.id",
        "u.email",
        "u.name",
      ])
      .select(sql<Date>`cr."xata.updatedAt"`.as("updated_at"))
      .orderBy("updated_at desc");

    const result = await query.execute();
    return result;
  } catch (e) {
    throw e;
  }
};

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
