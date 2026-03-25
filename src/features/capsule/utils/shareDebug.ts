// TODO : 디버깅용 파일. 배포 전 삭제예정
type ShareNavigator = Navigator & {
  share?: (data?: ShareData) => Promise<void>;
};

export function logShareDebug() {
  const shareNavigator = navigator as ShareNavigator;

  console.log("[share] clicked");
  console.log("[share] navigator.share:", shareNavigator.share);
  console.log("[share] navigator.clipboard:", navigator.clipboard);
}
