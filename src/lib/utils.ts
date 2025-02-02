import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * fungsi ini digunakan untuk konversi created_at dan updated_at dari
 * xata ke format ISO string agar dapat di-parse oleh android
 */
export const convertDatetimeToISO = (datetime: string): string => {
  const date = Date.parse(datetime);
  return new Date(date).toISOString();
};

const mqttBaseTopic = "com.unitip/mqtt-notifier";
export const getPrefixedTopic = (topic: string) => `${mqttBaseTopic}/${topic}`;

import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

export function formatDate(date: Date | string | null): string {
  if (!date) return "N/A";

  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  return format(parsedDate, "dd/MM/yyyy, HH:mm", { locale: id });
}

/**
 * @deprecated
 * gunakan uuid v4 dari package uuid langsung agar lebih random
 */
export const generateRandomToken = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters[randomIndex];
  }

  return token;
};
