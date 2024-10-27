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
  subscribe: (topic: string) => void;
  unsubscribe: (topic: string) => void;
}

const MqttClientContext = createContext<
  (MqttClientState & MqttClientAction) | undefined
>(undefined);

const baseMqttTopic = "com.unitip/mqtt-notifier";

export const MqttClientProvider = (props: PropsWithChildren) => {
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
        console.log("Connected to mqtt broker");
      });
    }

    return () => {
      if (mqttClient) {
        mqttClient.end();
        setTopics([]);
      }
    };
  }, [mqttClient]);

  const subscribe = (topic: string) => {
    if (mqttClient) {
      mqttClient.subscribe(topic, { qos: 2 }, (err) => {
        if (err) console.error(err);
        else setTopics((prevTopics) => [...prevTopics, topic]);
      });
    }
  };

  const unsubscribe = (topic: string) => {
    if (mqttClient) {
      mqttClient.unsubscribe(topic, (err) => {
        if (err) console.error(err);
        else setTopics((prevTopics) => prevTopics.filter((t) => t !== topic));
      });
    }
  };

  return (
    <>
      <MqttClientContext.Provider
        value={{
          mqttClient,
          subscribe,
          unsubscribe,
        }}
      >
        {props.children}
      </MqttClientContext.Provider>
    </>
  );
};

export const useMqttClient = (props: {
  onMessage?: (topic: string, message: Buffer) => void;
}) => {
  const context = useContext(MqttClientContext);
  if (context === undefined)
    throw new Error("useMqttClient must be used within a MqttClientProvider");

  const { mqttClient } = context;

  useEffect(() => {
    if (mqttClient) {
      if (props.onMessage) mqttClient.on("message", props.onMessage);
    }
  }, [mqttClient]);

  return context;
};
