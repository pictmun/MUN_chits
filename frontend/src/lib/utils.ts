import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatMessageTime = (timestamp: string): string => {
  const messageDate = new Date(timestamp);
  const currentDate = new Date();

  const isSameDay =
    messageDate.getDate() === currentDate.getDate() &&
    messageDate.getMonth() === currentDate.getMonth() &&
    messageDate.getFullYear() === currentDate.getFullYear();

  if (isSameDay) {
    // If the message is from the same day, return the time
    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } else {
    // If the message is from a previous day, return the date
    return messageDate.toLocaleDateString();
  }
};
