import { motion } from 'framer-motion';
import GradientButton from './GradientButton';

interface HeroSectionProps {
  displayedTitle: string;
  typingDone: boolean;
  onGetStarted: () => void;
  isLoading: boolean;
}

const HeroSection = ({ displayedTitle, typingDone, onGetStarted, isLoading }: HeroSectionProps) => (
  <div
    id="hero"
    className="w-full h-auto flex flex-col items-center justify-center text-center text-white mt-[60px] px-28 py-32"
    style={{ minHeight: 'calc(100vh - 60px)' }}
  >
    <motion.h1
      className="text-5xl font-bold mb-3 whitespace-pre-line"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9 }}
    >
      Find Your <span className="bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent inline-block">First GitHub Contribution</span>
      {!typingDone && <span className="inline-block animate-pulse">|</span>}
    </motion.h1>
    <p className="text-md text-text-gray">
      Find beginner-friendly GitHub issues tailored to your skills and experience
    </p>
    <GradientButton
      className="mt-10"
      onClick={onGetStarted}
      disabled={isLoading}
    >
      Get Started
    </GradientButton>
  </div>
);

export default HeroSection;
