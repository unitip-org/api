import { AuthTokenType } from "@/lib/auth-token";
import { getPrefixedTopic } from "@/lib/utils";
import mqtt from "mqtt";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

interface MqttClientState {
  mqttClient?: mqtt.MqttClient;
  onlineDriverCount?: number;
}

interface MqttClientAction {
  publish: (topic: string, message: string) => void;
  subscribe: (topic: string) => void;
  unsubscribe: (topic: string) => void;
}

const MqttClientContext = createContext<
  (MqttClientState & MqttClientAction) | undefined
>(undefined);

export const MqttClientProvider = (
  props: PropsWithChildren<{
    debug?: boolean;
    session?: AuthTokenType;
  }>
) => {
  const [topics, setTopics] = useState<string[]>([]);
  const [mqttClient, setMqttClient] = useState<mqtt.MqttClient>();
  const [onlineDriverIds, setOnlineDriverIds] = useState<string[]>([]);

  // connect to mqtt broker
  useEffect(() => {
    setMqttClient(
      mqtt.connect({
        host: "broker.hivemq.com",
        protocol: "wss",
        port: 8884,
        path: "/mqtt",
        will:
          (props.session &&
            props.session.role === "driver" && {
              topic: getPrefixedTopic("user/status/" + props.session.id),
              payload: Buffer.from("offline"),
              qos: 2,
              retain: true,
            }) ||
          undefined,
      })
    );
  }, []);

  // listen to mqtt client
  useEffect(() => {
    if (mqttClient) {
      // listen connection status
      mqttClient.on("connect", () => {
        if (props.debug) console.log("Connected to mqtt broker");

        // subscribe to driver status
        subscribe(getPrefixedTopic("user/status/#"));

        // publish status online driver ke broker
        if (props.session) {
          // berarti user sedang login
          const { id, role } = props.session;
          if (role === "driver")
            publish(getPrefixedTopic("user/status/" + id), "online", true);
        }
      });

      mqttClient.on("message", (topic, message) => {
        if (topic.startsWith(getPrefixedTopic("user/status"))) {
          if (String(message) === "online")
            setOnlineDriverIds((prev) => [
              ...prev.filter((it) => it !== topic),
              topic,
            ]);
          else if (String(message) === "offline")
            setOnlineDriverIds((prev) => prev.filter((it) => it !== topic));
        }
      });
    }

    return () => {
      if (mqttClient) {
        mqttClient.end();
        setTopics([]);
      }
    };
  }, [mqttClient, props.session]);

  const publish = (topic: string, message: string, retain?: boolean) => {
    if (mqttClient) {
      mqttClient.publish(topic, message, { qos: 2, retain: retain }, (err) => {
        if (props.debug) {
          if (err) console.error(err);
          else console.log("Published to topic:", topic, message);
        }
      });
    }
  };

  const subscribe = (topic: string) => {
    if (mqttClient) {
      mqttClient.subscribe(topic, { qos: 2 }, (err) => {
        if (err) {
          if (props.debug) console.error(err);
        } else {
          if (props.debug) console.log("Subscribed to topic:", topic);
          setTopics((prevTopics) => [...prevTopics, topic]);
        }
      });
    }
  };

  const unsubscribe = (topic: string) => {
    if (mqttClient) {
      mqttClient.unsubscribe(topic, (err) => {
        if (err) {
          if (props.debug) console.error(err);
        } else {
          if (props.debug) console.log("Unsubscribed from topic:", topic);
          setTopics((prevTopics) => prevTopics.filter((t) => t !== topic));
        }
      });
    }
  };

  return (
    <>
      <MqttClientContext.Provider
        value={{
          mqttClient,
          publish,
          subscribe,
          unsubscribe,
          onlineDriverCount: onlineDriverIds.length,
        }}
      >
        {props.children}
      </MqttClientContext.Provider>
    </>
  );
};

export const useMqttClient = (props?: {
  onMessage?: (topic: string, message: Buffer) => void;
}) => {
  const context = useContext(MqttClientContext);
  if (context === undefined)
    throw new Error("useMqttClient must be used within a MqttClientProvider");

  const { mqttClient } = context;

  useEffect(() => {
    if (mqttClient) {
      mqttClient.on("message", (topic, message) => {
        if (props?.onMessage) {
          props.onMessage(topic, message);
        }
      });
    }
  }, [mqttClient]);

  return context;
};
