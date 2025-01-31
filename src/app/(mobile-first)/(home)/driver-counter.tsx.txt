"use client";

import { useMqttClient } from "@/contexts/mqtt-client";

export default function DriverCounter() {
  const { onlineDriverCount } = useMqttClient();

  return (
    <>
      <div className="border rounded-lg mt-4 p-4">
        <p>Driver counter</p>
        <p>Total online: {onlineDriverCount}</p>
      </div>
    </>
  );
}
