import React from "react";
import { motion } from "framer-motion";
import HeroBackground from "./HeroBackground";
import { Button } from "../ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export const Hero = ({ onInquireVA, onInquireTeam }) => {
  const { theme } = useTheme();
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden grain" data-testid="hero-section">
      {/* Background gradient base */}
      <div className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 0%, var(--hero-spot) 0%, transparent 60%), linear-gradient(180deg, var(--hero-base-1) 0%, var(--hero-base-1) 70%, var(--hero-base-2) 100%)",
        }}
      />

      {/* 3D Canvas */}
      <HeroBackground theme={theme} />

      {/* Foreground content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-28 sm:pt-32 lg:pt-36 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs sm:text-sm text-white/85"
          data-testid="hero-badge"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-hl dark:bg-amber-400 pulse-dot" />
          <Sparkles size={14} className="text-hl dark:text-amber-400" />
          <span className="tracking-wide">People. Skills. Results.</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="h-display mt-6 max-w-4xl text-white"
        >
          <span className="text-hl">Where digital talent <br className="hidden sm:block" />
          and business needs</span> <span className="text-amber-400">come together.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-6 max-w-2xl text-base sm:text-lg text-white/70 leading-relaxed"
        >
          WorkQuire bridges top-tier remote talent w/ambitious organizations. From onboarding to execution,
          we make collaboration simple, structured & effective.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md sm:max-w-none"
        >
          <Button
            onClick={onInquireTeam}
            className="group bg-amber-500 hover:bg-amber-600 text-navy-900 font-semibold rounded-full px-6 py-6 text-base amber-glow"
            data-testid="hero-inquire-team-btn"
          >
            Inquire Talents Team Now
            <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            onClick={onInquireVA}
            variant="outline"
            className="group bg-white/5 border-white/15 text-white hover:bg-white/10 hover:text-white rounded-full px-6 py-6 text-base"
            data-testid="hero-inquire-va-btn"
          >
            Get Talent Now
            <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-14 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5 max-w-3xl"
          data-testid="hero-stats"
        >
          {[
            { k: "2021", v: "Founded" },
            { k: "14+", v: "Talent Roles" },
            { k: "100%", v: "Money-back" },
            { k: "24/7", v: "Sourcing" },
          ].map((s, i) => (
            <div key={i} className="bg-navy-900/60 backdrop-blur px-4 py-4 sm:py-5">
              <div className="font-display font-bold text-amber-400 text-xl sm:text-2xl">{s.k}</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/55 mt-1">{s.v}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2 text-white/55">
        <div className="w-[1px] h-10 bg-gradient-to-b from-amber-400 to-transparent" />
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
      </div>
    </section>
  );
};

export default Hero;
