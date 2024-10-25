"use server";

import { database } from "@/lib/database";
import { sql } from "kysely";

export const createMessage = async (props: {
  fromUserId: string;
  toUserId: string;
  message: string;
}) => {
  try {
    const query = database
      .insertInto("chats")
      .values({
        from: props.fromUserId,
        to: props.toUserId,
        message: props.message,
      } as any)
      .returning("id");

    const result = await query.execute();
    if (result) return true;
    return false;
  } catch (e) {
    throw e;
  }
};

export const getAllMessages = async (props: {
  fromUserId: string;
  toUserId: string;
}) => {
  try {
    const query = database
      .selectFrom("chats as c")
      .select(["c.message", "c.from", "c.to"])
      .select(sql<Date>`c."xata.createdAt"`.as("created_at"))
      .where((eb) =>
        eb.or([
          eb("c.from", "=", props.fromUserId as any).and(
            "c.to",
            "=",
            props.toUserId as any
          ),
          eb("c.to", "=", props.fromUserId as any).and(
            "c.from",
            "=",
            props.toUserId as any
          ),
        ])
      )
      .orderBy("created_at asc");

    const result = await query.execute();
    return result;
  } catch (e) {
    throw e;
  }
};
