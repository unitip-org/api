"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import mqtt from "mqtt";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FormattedDate } from "react-intl";
import { getAllChats } from "./actions";

const mqttBaseTopic = "com.unitip/notifier-chat-rooms";

export default function ListChats(props: { authenticatedUserId: string }) {
  const mqttSubTopic = `${mqttBaseTopic}/${props.authenticatedUserId}`;

  const [mqttClient, setMqttClient] = useState<mqtt.MqttClient>();

  // connect to mqtt notifier
  useEffect(() => {
    setMqttClient(
      mqtt.connect({
        host: "broker.hivemq.com",
        protocol: "wss",
        port: 8884,
        path: "/mqtt",
      })
    );
  }, []);
  useEffect(() => {
    if (mqttClient) {
      mqttClient.on("connect", () => {
        console.log("connect to mqtt broker");

        // subscribe to mqtt topic
        mqttClient.subscribe(mqttSubTopic, (err) => {
          if (err) console.log("error subscribe to mqtt topic", err);
          else console.log("subscribe to mqtt topic", mqttSubTopic);
        });

        // listen to mqtt message notifier
        mqttClient.on("message", (topic, message) => {
          console.log("mqtt message", topic, message.toString());
          refetchChats();
        });
      });
    }
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
                  <p className="text-sm text-muted-foreground">
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
