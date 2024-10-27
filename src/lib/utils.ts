import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const mqttBaseTopic = "com.unitip/mqtt-notifier";
export const getPrefixedTopic = (topic: string) => `${mqttBaseTopic}/${topic}`;
