// src/data/messages.ts
export type Message = {
  id: number;
  sender: string;
  subject: string;
  timestamp: string;
  message: string;
  sendViaEB: boolean;
  isUnread: boolean;
};

export const messages: Message[] = [
  {
    id: 1,
    sender: "America",
    subject: "Global Invasion",
    message: "Keep My country's name off yo mouth!!!",
    timestamp: "10:30 AM",
    isUnread: true,
    sendViaEB: true,
  },
  {
    id: 2,
    sender: "Japan",
    subject: "Watch some anime dude",
    message: "Anime is culture, embrace it!",
    timestamp: "9:00 AM",
    isUnread: false,
    sendViaEB: false,
  },
];
