"use client";

import { Button } from "@/components/ui/button";
import { useCounter } from "@/contexts/counter";

export default function TestCounter() {
  const { increment, state } = useCounter();

  return (
    <>
      <p>Counter value: {state.count}</p>
      <Button onClick={increment}>Increment</Button>
    </>
  );
}
