export const TitleRule = (title: string) => {
  const value = title.trimStart().slice(0, 100);

  if (1 <= value.length && value.length <= 100)
    return { value: value, boolean: true };
  return { value: value, boolean: false };
};

export const PasswordRule = (pw: string) => {
  const value = pw;
  const numericValue = value.replace(/\D/g, "").slice(0, 4);
  if (numericValue.length == 4) return { value: numericValue, boolean: true };
  return { value: numericValue, boolean: false };
};

export const SlugRule = (slug: string) => {
  const value = slug
    .trimStart()
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toLowerCase()
    .slice(0, 50);
  if (1 <= value.length && value.length <= 50)
    return { value: value, boolean: true };
  return { value: value, boolean: false };
};

export const nickNameRule = (nickname: string) => {
  const value = nickname.trimStart().slice(0,20);
  if (1 <= value.length && value.length <= 20)
    return { value: value, boolean: true };
  return { value: value, boolean: false };
};

export const ContentRule = (content: string) => {
  const value = content.trimStart().slice(0,1000);
  if (1 <= value.length && value.length <= 1000)
    return { value: value, boolean: true };
  return { value: value, boolean: false };
};
