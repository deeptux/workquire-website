import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Lightbulb, UserRound } from "lucide-react";

const business = [
  "Can't find the right talent",
  "Overpaying with poor results",
  "Misaligned expectations",
  "Trust issues with agencies & freelancers",
  "No time or clarity on who to hire",
];
const freelancers = [
  "Low or unfair pay",
  "Late or unpaid work",
  "Work used without permission",
  "Limited access to quality clients",
  "No protection or clear agreements",
];

const Col = ({ icon: Icon, label, title, items, accent, testid }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6 }}
    className="relative rounded-3xl border border-white/10 bg-navy-800/40 p-6 sm:p-9 overflow-hidden transition-colors duration-300 hover:border-amber-500/30"
    data-testid={testid}
  >
    <div className="flex items-center gap-3">
      <span className={`w-10 h-10 rounded-xl inline-flex items-center justify-center ${accent}`}>
        <Icon size={18} />
      </span>
      <div className="eyebrow dark:text-amber-400">{label}</div>
    </div>
    <h3 className="mt-5 font-display font-bold text-white text-xl sm:text-2xl">{title}</h3>
    <ul className="mt-6 space-y-3">
      {items.map((it) => (
        <li key={it} className="flex items-start gap-3 text-white/75">
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
          <span className="text-sm sm:text-base leading-relaxed">{it}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

export const WhyBuilt = () => {
  return (
    <section id="why" className="relative py-20 sm:py-28" data-testid="why-built-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="eyebrow">Why we built WorkQuire</div>
          <h2 className="h-section mt-3 text-white">
            Where businesses and talents <span className="text-amber-400">struggled</span>.
          </h2>
          <p className="mt-5 text-white/65 text-base sm:text-lg leading-relaxed">
            Both sides operated in a system that lacked trust, clarity & alignment. We built a
            structured, performance-driven partnership that protects everyone involved.
          </p>
        </motion.div>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          <Col
            icon={Briefcase}
            label="Business owners"
            title="Hiring was a gamble."
            items={business}
            accent="bg-amber-500/15 border border-amber-500/30 text-amber-400"
            testid="business-owners-col"
          />
          <Col
            icon={UserRound}
            label="Freelancers"
            title="Talent was undervalued."
            items={freelancers}
            accent="bg-white/5 border border-white/10 text-amber-400"
            testid="freelancers-col"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-10 sm:mt-14 rounded-3xl border border-amber-500/25 bg-amber-500/[0.04] p-6 sm:p-8 flex flex-col md:flex-row md:items-center gap-4"
          data-testid="why-built-resolution"
        >
          <div
            className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 inline-flex items-center justify-center text-hl dark:text-amber-400 shrink-0"
            aria-hidden
          >
            <Lightbulb size={24} strokeWidth={2} />
          </div>
          <p className="text-white/85 text-base sm:text-lg leading-relaxed">
            That realization is what led us to build <span className="font-semibold">WorkQuire</span> → a structured,
            trustworthy hiring system that aligns expectations from the start and builds long-term, performance-driven partnerships.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyBuilt;
