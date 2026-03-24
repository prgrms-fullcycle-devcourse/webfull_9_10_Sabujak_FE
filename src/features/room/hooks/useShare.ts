// TODO: 공유 기능 테스트가 끝나면 삭제
import { logShareDebug } from "../utils/shareDebug";
// /TODO

export type ShareUrlParams = {
  title: string;
  text?: string;
  url: string;
};

function isMobile() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

function fallbackCopyText(text: string) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  textArea.style.pointerEvents = "none";

  document.body.appendChild(textArea);
  textArea.select();
  textArea.setSelectionRange(0, text.length);

  const copied = document.execCommand("copy");
  document.body.removeChild(textArea);

  return copied;
}

export function useShare() {
  const canShare =
    typeof navigator !== "undefined"
    && typeof navigator.share === "function"
    && isMobile();

  const shareUrl = async ({ title, text, url }: ShareUrlParams) => {
    try {
      // TODO: 공유 기능 테스트가 끝나면 삭제
      if (import.meta.env.DEV) {
        logShareDebug();
      }
      // /TODO

      if (canShare) {
        console.log("[share] using Web Share API");

        await navigator.share({
          title,
          text,
          url,
        });
        return;
      }

      if (navigator.clipboard?.writeText) {
        console.log("[share] using clipboard fallback");

        try {
          await navigator.clipboard.writeText(url);
          alert("링크가 복사되었어요.");
          return;
        } catch (clipboardError) {
          console.warn("[share] clipboard.writeText failed", clipboardError);
        }
      }

      if (fallbackCopyText(url)) {
        console.log("[share] using execCommand fallback");
        alert("링크가 복사되었어요.");
        return;
      }

      console.warn("[share] clipboard API is not available");
      alert("링크 복사에 실패했어요. 다시 시도해주세요.");
    } catch (error) {
      console.error("[share] failed", error);
      alert("공유에 실패했어요. 다시 시도해주세요.");
    }
  };

  return { shareUrl, canShare };
}

export default useShare;
