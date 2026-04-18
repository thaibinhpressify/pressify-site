import type { Directive, DirectiveBinding } from "vue";

type ClickOutsideEl = HTMLElement & {
  __clickOutsideHandler__?: (event: MouseEvent | TouchEvent) => void;
};

function isEventInside(el: HTMLElement, event: Event) {
  const target = event.target as Node | null;
  return !!target && el.contains(target);
}

export const clickOutside: Directive<ClickOutsideEl, (event: Event) => void> = {
  mounted(el, binding: DirectiveBinding<(event: Event) => void>) {
    const handler = (event: MouseEvent | TouchEvent) => {
      if (isEventInside(el, event)) return;
      binding.value?.(event);
    };

    el.__clickOutsideHandler__ = handler;
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
  },
  unmounted(el) {
    const handler = el.__clickOutsideHandler__;
    if (!handler) return;

    document.removeEventListener("mousedown", handler);
    document.removeEventListener("touchstart", handler);
    delete el.__clickOutsideHandler__;
  },
};
