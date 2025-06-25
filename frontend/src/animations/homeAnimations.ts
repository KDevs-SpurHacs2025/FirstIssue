// Animations for Home page sections
// ----------------------------------

// Hero Section (Typing Animation)
import { useEffect, useState } from "react";

/**
 * Custom hook for typing animation effect (used in Home Hero section)
 * @param fullText The full string to animate (can include \n for line breaks)
 * @param speed Typing speed in ms per character (default: 50)
 * @returns [displayedText, typingDone]
 */
export function useHomeTypingAnimation(fullText: string, speed: number = 50): [string, boolean] {
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

// Section 1: Discovery Cards
export const homeSection1Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      staggerChildren: 0.15,
    },
  },
};

export const homeSection1ItemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
    },
  },
};

// Section 2: Timeline Animation
export const homeTimelineFillMotion = {
  initial: { height: 0 },
  whileInView: { height: '100%' },
  transition: { duration: 0.7, ease: [0.42, 0, 0.58, 1] },
};

export const homeStepRevealMotion = [
  // Step 1
  {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
    viewport: { once: true, amount: 0.5 },
  },
  // Step 2
  {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: 0.13 },
    viewport: { once: true, amount: 0.5 },
  },
  // Step 3
  {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: 0.26 },
    viewport: { once: true, amount: 0.5 },
  },
  // Step 4
  {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: 0.39 },
    viewport: { once: true, amount: 0.5 },
  },
];

// Section 3: Animated Gradient Border for Get Started Button
// Usage: Wrap your button like this:
// <div className={homeGetStartedButtonBorderClass}>
//   <span className={homeGetStartedButtonBorder} aria-hidden="true" />
//   <GradientButton className="relative z-10" ...>Get Started</GradientButton>
// </div>
export const homeGetStartedButtonBorderClass =
  "relative inline-block group";

export const homeGetStartedButtonBorder =
  "absolute -inset-1 rounded-lg bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-fuchsia-500 bg-[length:200%_200%] animate-gradient-border z-0";

