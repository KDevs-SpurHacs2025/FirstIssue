import React from "react";

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const GradientButton: React.FC<GradientButtonProps> = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`font-semibold border border-primary rounded-xl bg-gradient-to-r from-primary/70 via-primary/40 to-primary/70 text-white backdrop-blur-sm shadow-md hover:from-primary/90 hover:to-primary/90 transition-colors duration-300 ease-in ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default GradientButton;
