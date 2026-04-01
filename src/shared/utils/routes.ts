export function buildCapsuleDetailPath(slug: string) {
  return `/capsules/${encodeURIComponent(slug)}`;
}

export function extractCapsuleSlug(input: string) {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    return "";
  }

  try {
    const url = new URL(trimmedInput);
    const capsulePathMatch = url.pathname.match(/^\/capsules\/([^/]+)$/);

    if (capsulePathMatch) {
      return decodeURIComponent(capsulePathMatch[1]);
    }
  } catch {
    // URL 형식이 아니면 사용자가 입력한 값을 slug로 간주한다.
  }

  return trimmedInput;
}
