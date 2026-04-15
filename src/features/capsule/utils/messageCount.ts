export type CapsuleMessageCountPayload = {
  messageCount: number;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isCapsuleMessageCountPayload = (
  value: unknown,
): value is CapsuleMessageCountPayload => {
  return (
    isRecord(value)
    && typeof value.messageCount === "number"
  );
};

const hasMessageEventData = (
  event: Event,
): event is MessageEvent<string> => {
  return "data" in event && typeof event.data === "string";
};

const buildCapsuleMessageCountStreamUrl = (slug: string) => {
  const apiBaseUrl = import.meta.env.VITE_API_URL ?? window.location.origin;

  return new URL(`/capsules/${slug}/message-count/stream`, apiBaseUrl).toString();
};

export const connectCapsuleMessageCountStream = (
  slug: string,
  onMessageCount: (messageCount: number) => void,
) => {
  const eventSource = new EventSource(buildCapsuleMessageCountStreamUrl(slug));

  const handleMessageCount = (event: Event) => {
    try {
      if (!hasMessageEventData(event)) {
        return;
      }

      const parsed: unknown = JSON.parse(event.data);

      if (!isCapsuleMessageCountPayload(parsed)) {
        return;
      }

      onMessageCount(parsed.messageCount);
    } catch (error) {
      console.error("Failed to parse messageCount SSE payload", error);
    }
  };

  eventSource.addEventListener(
    "messageCount",
    handleMessageCount as EventListener,
  );

  // CONNECTING = 재연결 중
  // CLOSED = SSE closed
  eventSource.onerror = () => {
    if (eventSource.readyState === EventSource.CONNECTING) {
      return;
    }
    if (eventSource.readyState === EventSource.CLOSED) {
      console.warn("messageCount SSE closed");
    }
  };

  return () => {
    eventSource.removeEventListener(
      "messageCount",
      handleMessageCount as EventListener,
    );
    eventSource.close();
  };
};
