import React from 'react';
import { motion } from 'framer-motion';

const Particle = ({ delay }: { delay: number }) => (
  <motion.div
    className="w-2 h-2 rounded-full bg-blue-500 absolute"
    animate={{
      scale: [1, 1.5, 1.5, 1, 1],
      rotate: [0, 0, 270, 270, 0],
      borderRadius: ["20%", "20%", "50%", "50%", "20%"],
    }}
    transition={{
      duration: 2,
      ease: "easeInOut",
      times: [0, 0.2, 0.5, 0.8, 1],
      repeat: Infinity,
      repeatDelay: 1,
      delay,
    }}
  />
);

const LoadingAnimation: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-24 h-24">
        {[...Array(8)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.2,
            }}
          >
            <Particle delay={index * 0.2} />
          </motion.div>
        ))}
      </div>
      <motion.div
        className="mt-8 text-2xl font-bold text-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        Loading your experience
      </motion.div>
      <motion.div
        className="mt-2 text-lg text-gray-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        Please wait while we prepare something amazing for you
      </motion.div>
    </div>
  );
};

export default LoadingAnimation;

