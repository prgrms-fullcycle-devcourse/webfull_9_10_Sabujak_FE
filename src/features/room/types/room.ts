export interface Message {
  id: number;
  nickname: string;
  content: string;
  createdAt: string;
}

export interface RoomBase {
  id: string;
  slug: string;
  title: string;
  openAt: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  isOpen: boolean;
  messageCount: number;
}

export interface RoomBeforeOpen extends RoomBase {
  isOpen: false;
}

export interface RoomOpened extends RoomBase {
  isOpen: true;
  messages: Message[];
}

export type RoomDetail = RoomBeforeOpen | RoomOpened;
