"use client";

import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMqttClient } from "@/contexts/mqtt-client";
import { cn, getPrefixedTopic } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, Loader2Icon, OctagonXIcon, SendIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormattedDate } from "react-intl";
import { z } from "zod";
import {
  createMessage,
  deleteConversation,
  deleteMessage,
  getAllMessages,
} from "./actions";

const formSchema = z.object({
  message: z
    .string({ required_error: "Pesan tidak boleh kosong!" })
    .min(1, "Pesan tidak boleh kosong!"),
});

export default function Client(props: {
  authenticatedUser: { id: string };
  toUser: { id: string };
}) {
  // from - to
  const mqttChatMessagesSubTopic = getPrefixedTopic(
    `chat-messages/${props.toUser.id}-${props.authenticatedUser.id}`
  );
  const mqttChatMessagesPubTopic = getPrefixedTopic(
    `chat-messages/${props.authenticatedUser.id}-${props.toUser.id}`
  );
  const mqttChatRoomsPubTopic = getPrefixedTopic(
    `chat-rooms/${props.toUser.id}`
  );

  const router = useRouter();

  const [isAtBottom, setIsAtBottom] = useState(false);

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

  const { publish, subscribe, unsubscribe, mqttClient } = useMqttClient({
    onMessage: (topic, message) => {
      if (topic === mqttChatMessagesSubTopic) {
        console.log("mqtt message", topic, message.toString());
        refetchMessages();
      }
    },
  });

  useEffect(() => {
    subscribe(mqttChatMessagesSubTopic);

    return () => {
      unsubscribe(mqttChatMessagesSubTopic);
    };
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

      // send mqtt message to chat messages
      publish(mqttChatMessagesPubTopic, "new notification");

      // send mqtt message to chat rooms
      publish(mqttChatRoomsPubTopic, "new notification");
    },
  });
  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationFn: deleteConversation,
    onSuccess: () => router.back(),
  });
  const { mutate: mutateDeleteMessage, isPending: isPendingDeleteMessage } =
    useMutation({
      mutationFn: deleteMessage,
      onSuccess: () => {
        refetchMessages();

        // send mqtt message to chat messages
        publish(mqttChatMessagesPubTopic, "new notification");

        // send mqtt message to chat rooms
        publish(mqttChatRoomsPubTopic, "new notification");
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
            <div className="h-20"></div>

            <div className="flex flex-col gap-1">
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
                  isDeleted={message.is_deleted}
                  onClickMenuDeleteMessage={() =>
                    mutateDeleteMessage({
                      authenticatedUserId: props.authenticatedUser.id,
                      messageId: message.id,
                    })
                  }
                />
              ))}

              <div className="justify-center flex mt-4">
                <Button
                  variant={"destructive"}
                  onClick={() =>
                    mutateDelete({
                      authenticatedUserId: props.authenticatedUser.id,
                      toUserId: props.toUser.id,
                    })
                  }
                >
                  {isPendingDelete && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  End conversations
                </Button>
              </div>
            </div>

            <div className="h-[5.5rem]"></div>
          </div>
        )}

        {/* bubble message */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="fixed bottom-0 p-4 bg-background border-t w-full left-0 right-0">
              <div className="flex items-center gap-2 max-w-[512px] mx-auto">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input {...field} placeholder="Tulis pesan..." />
                      </FormControl>
                    </FormItem>
                  )}
                />

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
  onClickMenuDeleteMessage: () => void;
  position: "left" | "right";
  message: string;
  createdAt: Date;
  isDeleted: boolean;
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
        <ContextMenu>
          <ContextMenuTrigger
            asChild
            disabled={props.position === "left" || props.isDeleted}
          >
            <div
              className={cn(
                "max-w-[360px] rounded-lg shadow py-2 px-3 text-sm",
                props.position === "left" && "bg-muted text-muted-foreground",
                props.position === "right" &&
                  "bg-primary text-primary-foreground"
              )}
            >
              {props.isDeleted || <p>{props.message}</p>}
              {props.isDeleted && (
                <p className="italic">
                  <OctagonXIcon className="h-4 w-4 inline mr-1" />
                  pesan telah dihapus
                </p>
              )}
              {props.isDeleted || (
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
              )}
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuLabel>Opsi</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={props.onClickMenuDeleteMessage}>
              Hapus pesan
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    </>
  );
}
