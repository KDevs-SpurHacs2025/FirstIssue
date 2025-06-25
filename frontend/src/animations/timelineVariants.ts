// Animation variants and settings for the timeline section in Home.tsx

export const timelineFillMotion = {
  initial: { height: 0 },
  whileInView: { height: '100%' },
  transition: { duration: 0.7, ease: [0.42, 0, 0.58, 1] }, // easeInOut cubic-bezier
};

export const stepRevealMotion = [
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
