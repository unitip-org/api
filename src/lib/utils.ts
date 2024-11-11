import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const mqttBaseTopic = "com.unitip/mqtt-notifier";
export const getPrefixedTopic = (topic: string) => `${mqttBaseTopic}/${topic}`;

import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

export function formatDate(date: Date | string | null): string {
  if (!date) return 'N/A';
  
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'dd/MM/yyyy, HH:mm', { locale: id });
}