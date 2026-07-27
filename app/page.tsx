"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LandingGate() {
  const [mounted, setMounted] = useState(false);
  const { setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSelect = (themeId: string) => {
    setTheme(themeId);
    router.push("/portfolio");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-6 font-sans relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 relative z-10"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">Choose Your Perspective</h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
          Two distinct paths. One is built for precision, the other for storytelling. Which side of Aashray do you want to explore?
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8 max-w-5xl w-full relative z-10">
        
        {/* The Minimalist */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelect("minimalist")}
          className="flex-1 cursor-pointer group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 p-10 flex flex-col items-center text-center transition-all hover:border-slate-500 hover:shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h2 className="text-3xl font-light text-slate-100 mb-4 tracking-widest uppercase">The Minimalist</h2>
          <p className="text-slate-400 font-light leading-relaxed">
            Clean, sharp, and structured. Focus strictly on the code, the engineering precision, and the technical architecture.
          </p>
        </motion.div>

        {/* The Creative */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelect("creative")}
          className="flex-1 cursor-pointer group relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-900 border border-white/10 p-10 flex flex-col items-center text-center transition-all hover:shadow-[0_0_40px_rgba(192,38,211,0.3)]"
        >
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">The Creative</h2>
          <p className="text-purple-200 leading-relaxed font-medium">
            Vibrant, dynamic, and full of life. Discover the leadership, the story, and the personality behind the code.
          </p>
        </motion.div>

      </div>
    </div>
  );
}
