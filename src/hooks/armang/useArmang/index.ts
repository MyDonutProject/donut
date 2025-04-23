import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useEffect } from "react";

export function useArmang() {
  const { visible } = useWalletModal();

  function handleArmang() {
    if (!visible || typeof document === "undefined") {
      return;
    }

    setTimeout(() => {
      const el = document.getElementsByClassName(
        "wallet-adapter-modal-middle"
      )?.[0] as HTMLDivElement;

      if (!el) {
        return;
      }

      const phantomImage = document.createElement("img");
      phantomImage.src = "/donut/providers/phantom.svg";
      phantomImage.style.width = "100px";
      phantomImage.style.height = "100px";
      phantomImage.style.objectFit = "contain";
      phantomImage.style.marginBottom = "12px";
      phantomImage.style.borderRadius = "12px";
      phantomImage.style.overflow = "hidden";

      el.appendChild(phantomImage);

      const svg = el.getElementsByTagName("svg")?.[0] as SVGElement;

      if (!svg) {
        return;
      }

      svg.remove();

      // Create wrapper link
      const wrapper = document.createElement("a");
      wrapper.href = "https://phantom.app/download";
      wrapper.target = "_blank";
      wrapper.style.textDecoration = "none";
      wrapper.style.display = "flex";
      wrapper.style.flexDirection = "column";
      wrapper.style.alignItems = "center";
      wrapper.style.gap = "12px";

      // Move the original content into the wrapper
      const originalContent = el.innerHTML;
      wrapper.innerHTML = originalContent;

      // Create text element
      const text = document.createElement("p");
      text.textContent = "Click here to add Phantom";
      text.style.margin = "0";
      text.style.color = "#fff";
      text.style.fontSize = "14px";
      text.style.fontWeight = "500";
      text.style.opacity = "0.8";

      // Add text to wrapper
      wrapper.appendChild(text);

      // Replace original content with wrapped version
      el.innerHTML = "";
      el.appendChild(wrapper);
    }, 100); // 100ms delay to ensure modal is rendered
  }

  useEffect(handleArmang, [visible]);
}
