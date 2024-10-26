"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2Icon, RefreshCwIcon, SendIcon } from "lucide-react";
import mqtt from "mqtt";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormattedDate } from "react-intl";
import { z } from "zod";
import { createMessage, getAllMessages } from "./actions";

const formSchema = z.object({
  message: z
    .string({ required_error: "Pesan tidak boleh kosong!" })
    .min(1, "Pesan tidak boleh kosong!"),
});
const mqttChatMessageBaseTopic = "com.unitip/notifier-chat-messages";
const mqttChatRoomBaseTopic = "com.unitip/notifier-chat-rooms";

export default function Client(props: {
  authenticatedUser: { id: string };
  toUser: { id: string };
}) {
  // from - to
  const mqttSubTopic = `${mqttChatMessageBaseTopic}/${props.toUser.id}-${props.authenticatedUser.id}`;
  const mqttPubTopic = `${mqttChatMessageBaseTopic}/${props.authenticatedUser.id}-${props.toUser.id}`;

  const [isAtBottom, setIsAtBottom] = useState(false);
  const [mqttClient, setMqttClient] = useState<mqtt.MqttClient>();

  useEffect(() => {
    const handleScroll = () => {
      setIsAtBottom(
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 100
      );
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          refetchMessages();
        });
      });
    }
  }, [mqttClient]);

  const {
    data: dataMessages,
    refetch: refetchMessages,
    isLoading: isLoadingMessages,
  } = useQuery({
    queryKey: ["getAllMessages", props],
    queryFn: () =>
      getAllMessages({
        toUserId: props.toUser.id,
        fromUserId: props.authenticatedUser.id,
      }),
  });

  const { mutate: mutateCreate, isPending: isPendingCreate } = useMutation({
    mutationFn: createMessage,
    onSuccess: () => {
      form.reset({ message: "" });
      refetchMessages();

      // send mqtt message notification
      if (mqttClient) {
        //  publish ke chat messages
        mqttClient.publish(mqttPubTopic, "new notification", (err) => {
          if (err) console.log("error publish to mqtt topic", err);
          else console.log("publish to mqtt topic", mqttPubTopic);
        });

        // publish ke chat rooms
        mqttClient.publish(
          `${mqttChatRoomBaseTopic}/${props.toUser.id}`,
          "new notification",
          (err) => {
            if (err) console.log("error publish to mqtt topic", err);
            else console.log("publish to mqtt topic", mqttPubTopic);
          }
        );
      }
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutateCreate({
      fromUserId: props.authenticatedUser.id,
      toUserId: props.toUser.id,
      message: values.message,
    });
  };

  useEffect(() => {
    const scrollToBottom = () => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    };

    if (dataMessages && isAtBottom) scrollToBottom();
  }, [dataMessages, isAtBottom]);

  return (
    <>
      <div>
        {/* loading state */}
        {isLoadingMessages && (
          <div>
            <p>Loading chats...</p>
          </div>
        )}

        {/* list chats */}
        {!isLoadingMessages && dataMessages && (
          <div>
            <div className="flex flex-col gap-2">
              {dataMessages.map((message, index) => (
                <ChatBubble
                  key={"chatBubbleItem-" + index}
                  position={
                    (message.from as any) === props.authenticatedUser.id
                      ? "right"
                      : "left"
                  }
                  createdAt={message.created_at}
                  message={message.message}
                />
              ))}
            </div>

            <div className="h-[4.5rem]"></div>
          </div>
        )}

        {/* bubble message */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="fixed bottom-4 w-full left-0 right-0">
              <div className="flex items-center gap-2 px-4 max-w-[512px] mx-auto">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  size={"icon"}
                  className="rounded-full"
                  type="button"
                  variant={"outline"}
                  onClick={() => refetchMessages()}
                >
                  <RefreshCwIcon />
                </Button>
                <Button
                  size={"icon"}
                  className="rounded-full"
                  type="submit"
                  disabled={form.watch("message", "").length === 0}
                >
                  {isPendingCreate ? (
                    <Loader2Icon className="w-4 h-4 animate-spin" />
                  ) : (
                    <SendIcon />
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}

function ChatBubble(props: {
  position: "left" | "right";
  message: string;
  createdAt: Date;
}) {
  return (
    <>
      <div
        className={cn(
          "flex items-center px-4",
          props.position === "left" && "justify-start",
          props.position === "right" && "justify-end"
        )}
      >
        <div
          className={cn(
            "max-w-[360px] rounded-lg shadow py-2 px-3 text-sm",
            props.position === "left" && "bg-muted text-muted-foreground",
            props.position === "right" && "bg-primary text-primary-foreground"
          )}
        >
          <p>{props.message}</p>
          <p
            className={cn(
              "text-xs text-right mt-1",
              props.position === "left" && "text-muted-foreground/70",
              props.position === "right" && "text-primary-foreground/70"
            )}
          >
            <FormattedDate
              value={props.createdAt}
              hour="2-digit"
              minute="2-digit"
            />
          </p>
        </div>
      </div>
    </>
  );
}
