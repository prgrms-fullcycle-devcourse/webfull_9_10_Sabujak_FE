import React from "react";

export const handleEnterDown = (
  e: React.KeyboardEvent<
    HTMLInputElement | HTMLButtonElement | HTMLTextAreaElement
  >,
) => {
  if (e.nativeEvent.isComposing) return;
  if (e.currentTarget instanceof HTMLTextAreaElement) return;

  if (e.key === "Enter") {
    e.preventDefault();

    const scope =
      e.currentTarget.form ??
      e.currentTarget.closest<HTMLElement>('[data-enter-scope="true"]');
    if (!scope) return;

    const focusableElements = Array.from(
      scope.querySelectorAll<HTMLElement>('[data-enter-flow="true"]')
    ).filter((el) => {
      const target = el as
        | HTMLInputElement
        | HTMLButtonElement
        | HTMLTextAreaElement;

      return !target.disabled && target.tabIndex !== -1;
    });

    const currentIndex = focusableElements.indexOf(e.currentTarget);
    const nextElement = focusableElements[currentIndex + 1];

    if (nextElement) {
      if (nextElement.tagName === "BUTTON") {
        nextElement.click();
      } else {
        nextElement.focus();
      }
    }
  }
};
