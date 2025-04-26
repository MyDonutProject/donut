import { useCallback, useEffect, useState } from "react";

interface UseTypewriterProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenTexts?: number;
}

export function useTypewriter({
  texts,
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenTexts = 1000,
}: UseTypewriterProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);
  const [currentText, setCurrentText] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const typeText = useCallback(() => {
    const currentFullText = texts[currentTextIndex];

    if (isDeleting) {
      if (currentText === "") {
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        return;
      }

      const newText = currentText.slice(0, -1);
      setCurrentText(newText);
      return;
    }

    if (currentText === currentFullText) {
      setTimeout(() => {
        setIsDeleting(true);
      }, delayBetweenTexts);
      return;
    }

    const nextChar = currentFullText.charAt(currentText.length);
    setCurrentText((prev) => prev + nextChar);
  }, [currentText, currentTextIndex, isDeleting, texts, delayBetweenTexts]);

  useEffect(() => {
    const timeout = setTimeout(
      typeText,
      isDeleting ? deletingSpeed : typingSpeed
    );
    return () => clearTimeout(timeout);
  }, [typeText, isDeleting, deletingSpeed, typingSpeed]);

  return {
    currentText,
    isTyping: !isDeleting && currentText !== texts[currentTextIndex],
    isDeleting,
  };
}
