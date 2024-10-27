"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMqttClient } from "@/contexts/mqtt-client";
import { cn, getPrefixedTopic } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect } from "react";
import { FormattedDate } from "react-intl";
import { getAllChats } from "./actions";

export default function ListChats(props: { authenticatedUserId: string }) {
  const chatRoomTopic = getPrefixedTopic(
    `chat-rooms/${props.authenticatedUserId}`
  );

  const { subscribe, unsubscribe, mqttClient } = useMqttClient({
    onMessage: (topic, message) => {
      if (topic === chatRoomTopic) {
        console.log("mqtt message", topic, message.toString());
        refetchChats();
      }
    },
  });

  useEffect(() => {
    subscribe(chatRoomTopic);

    return () => {
      unsubscribe(chatRoomTopic);
    };
  }, [mqttClient]);

  const {
    data: dataChats,
    refetch: refetchChats,
    isLoading: isLoadingChats,
  } = useQuery({
    queryKey: ["getAllChats", props.authenticatedUserId],
    queryFn: () =>
      getAllChats({ authenticatedUserId: props.authenticatedUserId }),
  });

  return (
    <>
      {/* loading state */}
      {isLoadingChats && (
        <div>
          <p>Loading customers...</p>
        </div>
      )}

      {/* success state */}
      {!isLoadingChats && dataChats && (
        <div>
          {dataChats.map((chat, index) => (
            <Link href={"/chats/" + chat.id} key={"customerItem-" + index}>
              <div
                className={cn(
                  "flex items-center gap-4 px-4 py-3 hover:bg-muted rounded duration-300",
                  index === 0 || "border-t"
                )}
              >
                {/* avatar */}
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                {/* content */}
                <div className="flex-1">
                  <p className="font-semibold">{chat.name}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {chat.last_sent_user === (props.authenticatedUserId as any)
                      ? "Anda: "
                      : ""}
                    {chat.last_message}
                  </p>
                </div>

                {/* date */}
                <p className="text-xs text-muted-foreground">
                  <FormattedDate
                    value={chat.updated_at}
                    hour="2-digit"
                    minute="2-digit"
                  />
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
