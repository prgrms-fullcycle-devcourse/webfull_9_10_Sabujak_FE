import type { RoomBeforeOpen, RoomDetail, RoomOpened } from "../types/room";

const beforeOpenRoom: RoomBeforeOpen = {
  id: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
  slug: "our-graduation-2025",
  title: "우리들의 졸업 축하",
  openAt: "2026-04-04T12:00:00.000Z",
  expiresAt: "2026-04-11T12:00:00.000Z",
  createdAt: "2026-03-18T02:05:21.000Z",
  updatedAt: "2026-03-18T02:05:21.000Z",
  isOpen: false,
  messageCount: 15,
};

const openedRoom: RoomOpened = {
  id: "01ARZ3NDEKTSV4RRFFQ69G5FB0",
  slug: "opened-capsule",
  title: "우리들의 졸업 축하",
  openAt: "2026-03-01T12:00:00.000Z",
  expiresAt: "2026-04-11T12:00:00.000Z",
  createdAt: "2026-03-18T02:05:21.000Z",
  updatedAt: "2026-03-18T02:05:21.000Z",
  isOpen: true,
  messageCount: 4,
  messages: [
    {
      id: 1,
      nickname: "익명의 메시지",
      content: "1년 전 우리가 손을 들고 드디어 보내!를 꼭 지내고 있지?",
      createdAt: "2026-03-18T02:05:21.000Z",
    },
    {
      id: 2,
      nickname: "익명의 메시지",
      content: "미래의 나에게 손 편지 보내기 놀이로 해 봐. 잘 하고 있니?",
      createdAt: "2026-03-18T02:10:21.000Z",
    },
    {
      id: 3,
      nickname: "익명의 메시지",
      content: "우리 우정 영원하자! 시험날 친구들 보고싶다 정말.",
      createdAt: "2026-03-18T02:15:21.000Z",
    },
    {
      id: 4,
      nickname: "익명의 메시지",
      content: "오늘을 위해 열심히 달려온 우리 모두 그 생활에 취해봐!",
      createdAt: "2026-03-18T02:20:21.000Z",
    },
  ],
};

const roomFixtures: Record<string, RoomDetail> = {
  [beforeOpenRoom.slug]: beforeOpenRoom,
  [openedRoom.slug]: openedRoom,
};

export function useRoomDetail(slug: string) {
  return roomFixtures[slug] ?? null;
}
