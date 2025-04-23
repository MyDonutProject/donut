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

      // el.appendChild(phantomImage);

      // Create wrapper link
      const wrapper = document.createElement("a");
      wrapper.href = "https://phantom.app/download";
      wrapper.target = "_blank";
      wrapper.style.textDecoration = "none";
      wrapper.style.display = "flex";
      wrapper.style.flexDirection = "column";
      wrapper.style.alignItems = "center";
      wrapper.style.gap = "12px";
      wrapper.style.width = "100%";

      // Move the original content into the wrapper
      const originalContent = el.innerHTML;
      wrapper.innerHTML = originalContent;

      // Create button element
      const button = document.createElement("button");
      button.style.width = "100%";
      button.style.display = "flex";
      button.style.justifyContent = "center";
      button.style.alignItems = "center";
      button.style.gap = "8px";
      button.style.backgroundColor = "#9886E5";
      button.style.color = "#fff";
      button.style.border = "none";
      button.style.borderRadius = "8px";
      button.style.padding = "12px";
      button.style.fontSize = "14px";
      button.style.fontWeight = "700";
      button.style.cursor = "pointer";
      button.style.transition = "all 0.2s ease-in-out";
      button.style.marginTop = "24px";

      // Create icon
      const icon = document.createElement("img");
      icon.src = "/donut/providers/phantom.svg";
      icon.style.width = "16px";
      icon.style.height = "16px";
      icon.style.objectFit = "contain";

      // Create text span
      const text = document.createElement("span");
      text.textContent = "Download Phantom";

      // Add icon and text to button
      button.appendChild(icon);
      button.appendChild(text);

      // Add hover effect
      button.onmouseover = () => {
        button.style.transform = "scale(1.02)";
        button.style.opacity = "0.9";
      };
      button.onmouseout = () => {
        button.style.transform = "scale(1)";
        button.style.opacity = "1";
      };

      // Add button to wrapper
      wrapper.appendChild(button);

      // Replace original content with wrapped version
      el.innerHTML = "";
      el.appendChild(wrapper);
    }, 100); // 100ms delay to ensure modal is rendered
  }

  useEffect(handleArmang, [visible]);
}
