"use client";

import { CounterProvider } from "@/contexts/counter";
import { MqttClientProvider } from "@/contexts/mqtt-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { IntlProvider } from "react-intl";

const queryClient = new QueryClient();

export default function Provider(props: PropsWithChildren) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <IntlProvider locale="id">
          <CounterProvider>
            <MqttClientProvider>{props.children}</MqttClientProvider>
          </CounterProvider>
        </IntlProvider>
      </QueryClientProvider>
    </>
  );
}
