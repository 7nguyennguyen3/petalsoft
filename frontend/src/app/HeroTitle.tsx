"use client";

import { motion } from "framer-motion";

const HeroTitle = () => {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white text-shadow-lg"
    >
      Unveil Your
      <br />
      Unique Essence
    </motion.h1>
  );
};

export default HeroTitle;
