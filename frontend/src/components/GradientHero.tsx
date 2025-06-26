import React, { useEffect } from 'react'
import { animate, motion, useMotionTemplate, useMotionValue } from 'framer-motion';

const COLORS = ['#1e293b', '#312E81']; 
const GradientHero = () => {
    const color = useMotionValue(COLORS[0]);
    const bgImg = useMotionTemplate`
    radial-gradient(ellipse 120% 80% at 50% 0%, #0B1120 0%, ${color} 50%, #0B1120 100%)
  `;

    useEffect(() => {
        animate(color, COLORS, {
            ease: 'easeInOut',
            duration: 3,
            repeat: Infinity,
            repeatType: 'mirror',
        })
    }, []);

       return (
        <motion.div
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                background: bgImg,
                 pointerEvents: 'none',
            }}
            
        />
    );

}

export default GradientHero;
