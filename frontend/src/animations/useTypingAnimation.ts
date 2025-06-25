import { useEffect, useState } from "react";

/**
 * Custom hook for typing animation effect.
 * @param fullText The full string to animate (can include \n for line breaks)
 * @param speed Typing speed in ms per character (default: 50)
 * @returns [displayedText, typingDone]
 */
export function useTypingAnimation(fullText: string, speed: number = 50): [string, boolean] {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayed(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [fullText, speed]);

  const done = displayed.length === fullText.length;
  return [displayed, done];
}
