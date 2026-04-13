// TODO: 공유 기능 테스트가 끝나면 삭제
import { logShareDebug } from "../utils/shareDebug";
// /TODO

export type ShareUrlParams = {
  title: string;
  text?: string;
  url: string;
};

type KakaoShareOptions = {
  objectType: "text";
  text: string;
  link: {
    mobileWebUrl: string;
    webUrl: string;
  };
  buttonTitle: string;
};

declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Share: {
        sendDefault: (options: KakaoShareOptions) => void;
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

function isKakaoBrowser() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /KAKAOTALK/i.test(navigator.userAgent);
}

function isKakaoAvailable() {
  return typeof window !== "undefined" && !!window.Kakao;
}

async function waitForKakaoSdk(timeoutMs = 3000) {
  if (isKakaoAvailable()) {
    return true;
  }

  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 100);
    });

    if (isKakaoAvailable()) {
      return true;
    }
  }

  return false;
}

function initKakao() {
  if (!isKakaoAvailable() || !import.meta.env.VITE_KAKAO_JS_KEY) {
    return false;
  }

  if (!window.Kakao?.isInitialized()) {
    window.Kakao?.init(import.meta.env.VITE_KAKAO_JS_KEY);
  }

  return !!window.Kakao?.isInitialized();
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

function isShareCancelled(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const errorName =
    "name" in error && typeof error.name === "string" ? error.name.toLowerCase() : "";
  const errorMessage =
    "message" in error && typeof error.message === "string"
      ? error.message.toLowerCase()
      : "";

  if (errorName === "aborterror") {
    return true;
  }

  return (
    errorName.includes("abort")
    || errorName.includes("cancel")
    || errorMessage.includes("abort")
    || errorMessage.includes("cancel")
    || errorMessage.includes("canceled")
    || errorMessage.includes("cancelled")
    || errorMessage.includes("share canceled")
    || errorMessage.includes("share cancelled")
    || errorMessage.includes("the user aborted")
  );
}

export function useShare() {
  const canShare =
    isKakaoBrowser()
    || (
      typeof navigator !== "undefined"
      && typeof navigator.share === "function"
      && isMobile()
    );

  const shareUrl = async ({ title, text, url }: ShareUrlParams) => {
    try {
      // TODO: 공유 기능 테스트가 끝나면 삭제
      if (import.meta.env.DEV) {
        logShareDebug();
      }
      // /TODO

      if (isKakaoBrowser()) {
        try {
          await waitForKakaoSdk();

          if (initKakao()) {
            console.log("[share] using Kakao Share");

            window.Kakao?.Share.sendDefault({
              objectType: "text",
              text: [title, text].filter(Boolean).join("\n"),
              link: {
                mobileWebUrl: url,
                webUrl: url,
              },
              buttonTitle: "타임캡슐 보러가기",
            });
            return;
          }
        } catch (error) {
          console.warn("[share] Kakao Share failed, falling back to copy", error);
        }
      }

      if (
        typeof navigator !== "undefined"
        && typeof navigator.share === "function"
        && isMobile()
      ) {
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
          alert("링크를 복사했어요.");
          return;
        } catch (clipboardError) {
          console.warn("[share] clipboard.writeText failed", clipboardError);
        }
      }

      if (fallbackCopyText(url)) {
        console.log("[share] using execCommand fallback");
        alert("링크를 복사했어요.");
        return;
      }

      console.warn("[share] clipboard API is not available");
      alert("링크 복사에 실패했어요. 다시 시도해주세요.");
    } catch (error) {
      if (isShareCancelled(error)) {
        return;
      }

      console.error("[share] failed", error);
      alert("공유에 실패했어요. 다시 시도해주세요.");
    }
  };

  return { shareUrl, canShare };
}

export default useShare;
