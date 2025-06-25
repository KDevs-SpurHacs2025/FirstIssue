import type { MotionProps } from 'framer-motion';

// Animation for question blocks in the survey
export const questionBlockMotion: MotionProps = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.42, 0.42, 0.42, 0] },
};
