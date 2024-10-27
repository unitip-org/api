"use server";

import { database, xata } from "@/lib/database";
import { sql } from "kysely";

export const createMessage = async (props: {
  fromUserId: string;
  toUserId: string;
  message: string;
}) => {
  try {
    const result = await xata.transactions.run([
      {
        insert: {
          table: "chats",
          record: {
            from: props.fromUserId,
            to: props.toUserId,
            message: props.message,
          },
        },
      },
      {
        update: {
          table: "chat_rooms",
          upsert: true,
          id: `${props.fromUserId}-${props.toUserId}`,
          fields: {
            last_message: props.message,
            from_user: props.fromUserId,
            to_user: props.toUserId,
            last_sent_user: props.fromUserId,
          },
        },
      },
      {
        update: {
          table: "chat_rooms",
          upsert: true,
          id: `${props.toUserId}-${props.fromUserId}`,
          fields: {
            last_message: props.message,
            from_user: props.toUserId,
            to_user: props.fromUserId,
            last_sent_user: props.fromUserId,
          },
        },
      },
    ]);

    return result.results.length === 3;
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

export const getOtherProfile = async (props: { otherUserId: string }) => {
  try {
    const query = database
      .selectFrom("users as u")
      .where("u.id", "=", props.otherUserId as any)
      .select(["u.name"]);

    const result = await query.executeTakeFirst();
    return result;
  } catch (e) {}
};

export const deleteConversation = async (props: {
  authenticatedUserId: string;
  toUserId: string;
}) => {
  try {
    const queryChatMessages = database
      .deleteFrom("chats")
      .where((eb) =>
        eb.or([
          eb("chats.from", "=", props.authenticatedUserId as any).and(
            eb("chats.to", "=", props.toUserId as any)
          ),
          eb("chats.to", "=", props.authenticatedUserId as any).and(
            eb("chats.from", "=", props.toUserId as any)
          ),
        ])
      );
    const queryChatRooms = database
      .deleteFrom("chat_rooms")
      .where((eb) =>
        eb.or([
          eb("chat_rooms.from_user", "=", props.authenticatedUserId as any).and(
            eb("chat_rooms.to_user", "=", props.toUserId as any)
          ),
          eb("chat_rooms.to_user", "=", props.authenticatedUserId as any).and(
            eb("chat_rooms.from_user", "=", props.toUserId as any)
          ),
        ])
      );

    const result = await queryChatMessages.execute();
    const result2 = await queryChatRooms.execute();

    return result.length > 0 && result2.length > 0;
  } catch (e) {
    throw e;
  }
};
