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
  props: PropsWithChildren<{ debug?: boolean }>
) => {
  const [topics, setTopics] = useState<string[]>([]);
  const [mqttClient, setMqttClient] = useState<mqtt.MqttClient>();

  // connect to mqtt broker
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

  // listen to mqtt client
  useEffect(() => {
    if (mqttClient) {
      // listen connection status
      mqttClient.on("connect", () => {
        if (props.debug) console.log("Connected to mqtt broker");
      });
    }

    return () => {
      if (mqttClient) {
        mqttClient.end();
        setTopics([]);
      }
    };
  }, [mqttClient]);

  const publish = (topic: string, message: string) => {
    if (mqttClient) {
      mqttClient.publish(topic, message, { qos: 2 }, (err) => {
        if (props.debug) {
          if (err) console.error(err);
          else console.log("Published to topic:", topic);
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
