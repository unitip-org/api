"use client";

import { Button } from "@/components/ui/button";
import { useCounter } from "@/contexts/counter";

export default function TestCounter() {
  const { state, decrement } = useCounter();

  return (
    <>
      <p>Counter value: {state.count}</p>
      <Button onClick={decrement}>Decrement</Button>
    </>
  );
}
