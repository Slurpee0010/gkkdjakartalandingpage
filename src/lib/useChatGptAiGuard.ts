const PROTECTED_ELEMENT_ID = ["USE", "CHAT", "GPT", "AI", "ROOT"].join("_");
const PROTECTED_ELEMENT_TAG = ["use", "chat", "gpt", "ai"].join("-");
const VISIBILITY_EVENT = "gkkd:chat-gpt-ai-visibility";

let allowVisible = false;
let observer: MutationObserver | null = null;

function getProtectedNodes(root: ParentNode = document) {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      `#${PROTECTED_ELEMENT_ID}, ${PROTECTED_ELEMENT_TAG}#${PROTECTED_ELEMENT_ID}`,
    ),
  );
}

function injectDefaultStyles() {
  if (document.head.querySelector("[data-ui-visibility-guard]")) {
    return;
  }

  const style = document.createElement("style");
  style.setAttribute("data-ui-visibility-guard", "protected-root");
  style.textContent = `
    #${PROTECTED_ELEMENT_ID},
    ${PROTECTED_ELEMENT_TAG}#${PROTECTED_ELEMENT_ID} {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
      width: 0 !important;
      height: 0 !important;
      overflow: hidden !important;
    }
  `;
  document.head.prepend(style);
}

function hideProtectedNode(node: HTMLElement) {
  node.setAttribute("aria-hidden", "true");
  node.setAttribute("hidden", "");
  node.style.setProperty("display", "none", "important");
  node.style.setProperty("visibility", "hidden", "important");
  node.style.setProperty("opacity", "0", "important");
  node.style.setProperty("pointer-events", "none", "important");
}

function showProtectedNode(node: HTMLElement) {
  node.removeAttribute("aria-hidden");
  node.removeAttribute("hidden");
  node.style.removeProperty("display");
  node.style.removeProperty("visibility");
  node.style.removeProperty("opacity");
  node.style.removeProperty("pointer-events");
}

function applyVisibilityPolicy(root: ParentNode = document) {
  getProtectedNodes(root).forEach((node) => {
    if (allowVisible) {
      showProtectedNode(node);
      return;
    }

    hideProtectedNode(node);
  });
}

export function setUseChatGptAiVisibility(visible: boolean) {
  allowVisible = visible;
  applyVisibilityPolicy();
}

export function installUseChatGptAiGuard() {
  if (typeof document === "undefined") {
    return;
  }

  injectDefaultStyles();
  applyVisibilityPolicy();

  window.addEventListener(VISIBILITY_EVENT, (event) => {
    const nextVisible = (event as CustomEvent<{ visible?: boolean }>).detail?.visible === true;
    setUseChatGptAiVisibility(nextVisible);
  });

  if (observer) {
    return;
  }

  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) {
          return;
        }

        if (node.id === PROTECTED_ELEMENT_ID || node.matches(PROTECTED_ELEMENT_TAG)) {
          applyVisibilityPolicy(node.parentElement ?? document);
          return;
        }

        applyVisibilityPolicy(node);
      });
    });
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
}
