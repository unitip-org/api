import { createContext, ReactNode, useContext, useState } from "react";

interface CounterState {
  count: number;
}

const initialState: CounterState = {
  count: 0,
};

const CounterContext = createContext<
  | {
      state: CounterState;
      increment: () => void;
      decrement: () => void;
    }
  | undefined
>(undefined);

export const CounterProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(initialState);

  const increment = () => setState({ count: state.count + 1 });
  const decrement = () => setState({ count: state.count - 1 });

  return (
    <CounterContext.Provider value={{ state, increment, decrement }}>
      {children}
    </CounterContext.Provider>
  );
};

export const useCounter = () => {
  const context = useContext(CounterContext);
  if (context === undefined) {
    throw new Error("useCounter must be used within a CounterProvider");
  }
  return context;
};
