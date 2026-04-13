// TODO: 공유 기능 테스트가 끝나면 삭제
import { logShareDebug } from "../utils/shareDebug";
// /TODO

export type ShareUrlParams = {
  title: string;
  text?: string;
  url: string;
};

// 카카오 SDK 전역 타입 선언
declare global {
  interface Window {
    Kakao: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Share: {
        sendDefault: (options: object) => void;
      };
    };
  }
}

function isMobile() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

function isKakaoAvailable() {
  return typeof window !== "undefined" && !!window.Kakao;
}

function initKakao() {
  if (!isKakaoAvailable()) return false;
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(import.meta.env.VITE_KAKAO_JS_KEY as string);
  }
  return window.Kakao.isInitialized();
}

function isKakaoBrowser() {
  return /KAKAOTALK/i.test(navigator.userAgent);
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

      // 카카오 브라우저에서는 Web Share API가 동작하지 않으므로 카카오 링크를 사용한다.
      if (isKakaoBrowser() && initKakao()) {
        console.log("[share] using Kakao Share");

        window.Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title,
            description: text ?? "",
            imageUrl: `${window.location.origin}/icons.svg`,
            link: {
              mobileWebUrl: url,
              webUrl: url,
            },
          },
          buttons: [
            {
              title: "타임캡슐 보러가기",
              link: {
                mobileWebUrl: url,
                webUrl: url,
              },
            },
          ],
        });
        return;
      }

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
