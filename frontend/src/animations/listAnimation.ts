// Animations for OpenSourceList page

import type { MotionProps } from "framer-motion";

// SVG "draw" animation for the empty state icon
export const emptyIconDrawMotion: MotionProps = {
  initial: { pathLength: 0, opacity: 0.3 },
  animate: { pathLength: 1, opacity: 1 },
  transition: {
    duration: 1.2,
    ease: "easeInOut",
  },
};

// Card hover scale animation
export const cardHoverMotion: MotionProps = {
    initial: { rotateY: 0, scale: 1 },
  whileHover: {
    rotateY: 12,
    scale: 1.01,
    transition: { type: "spring", stiffness: 180, damping: 18 }
  },
  whileTap: { scale: 0.98 }
};