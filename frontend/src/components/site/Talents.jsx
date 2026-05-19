import React from "react";
import { motion } from "framer-motion";
import {
  Megaphone, Sparkles, Share2, Palette, Film, Code2, Headphones,
  GraduationCap, Lightbulb, Sparkle, BarChart3, Handshake, ClipboardList, Users,
} from "lucide-react";

const talents = [
  { name: "Media Buyers / Paid Ads", icon: Megaphone },
  { name: "Content Creators", icon: Sparkles },
  { name: "Social Media Managers", icon: Share2 },
  { name: "Graphic Designers", icon: Palette },
  { name: "Video Editors", icon: Film },
  { name: "Web Developers", icon: Code2 },
  { name: "Virtual Assistants", icon: Users },
  { name: "Customer Support", icon: Headphones },
  { name: "Trainers / Coaches", icon: GraduationCap },
  { name: "Consultants", icon: Lightbulb },
  { name: "Brand Strategists", icon: Sparkle },
  { name: "Data Analysts", icon: BarChart3 },
  { name: "Sales Closers", icon: Handshake },
  { name: "Admin Assistants", icon: ClipboardList },
];

export const Talents = ({ onInquireTeam }) => {
  return (
    <section id="talents" className="relative py-20 sm:py-28 lg:py-32" data-testid="talents-section">
      <div className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(50% 50% at 80% 10%, var(--hero-spot) 0%, transparent 60%)",
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <div className="eyebrow">Talents we have</div>
            <h2 className="h-section mt-3 text-white">
              A roster built for <span className="text-hl dark:text-amber-400">every kind of growth</span>.
            </h2>
          </motion.div>
          <p className="text-white/55 max-w-md text-sm sm:text-base">
            Need a role you don't see here? We source it for you! Every placement is backed by our money-back guarantee.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-white/5 rounded-3xl overflow-hidden border border-white/5">
          {talents.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.025 }}
                className="group relative bg-navy-900/70 backdrop-blur p-4 sm:p-6 lg:p-7 cursor-default hover:bg-navy-800/80 transition-colors"
                data-testid={`talent-card-${i}`}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/5 border border-white/10 inline-flex items-center justify-center text-amber-400 group-hover:bg-amber-500/10 group-hover:border-amber-500/40 transition">
                  <Icon size={18} />
                </div>
                <div className="mt-4 sm:mt-5 font-display font-semibold text-white text-sm sm:text-base leading-snug">
                  {t.name}
                </div>
                <div className="mt-1 text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-white/40">
                  Vetted · Remote
                </div>
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-400/0 to-transparent group-hover:via-amber-400/60 transition" />
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={onInquireTeam}
            className="text-sm text-white/80 hover:text-amber-400 transition border-b border-amber-400/30 hover:border-amber-400 pb-1"
            data-testid="talents-cta-link"
          >
            Don't see your role? Tell us what you need →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Talents;
