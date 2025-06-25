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
