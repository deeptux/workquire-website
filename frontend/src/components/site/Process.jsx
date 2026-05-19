import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ShieldCheck } from "lucide-react";

const steps = [
  {
    n: "01",
    title: "Tell us what you need",
    desc: "Share your business goals, required skills, and expectations. We'll listen carefully and ask the right questions.",
  },
  {
    n: "02",
    title: "We match you with the right talent",
    desc: "We carefully recommend qualified talent options aligned with your needs — vetted, briefed, and ready to start.",
  },
  {
    n: "03",
    title: "Work with your chosen talent & scale",
    desc: "Collaborate with your preferred talent and focus on growing your business. We stay in the loop to keep things on track.",
  },
];

export const Process = ({ onInquireVA, onInquireTeam }) => {
  return (
    <section id="process" className="relative py-20 sm:py-28 lg:py-32" data-testid="process-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="eyebrow">How to work with us</div>
          <h2 className="h-section mt-3 text-white">
            Three steps. <span className="text-hl dark:text-amber-400">Zero guesswork.</span>
          </h2>
        </motion.div>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="relative rounded-3xl border border-white/10 bg-navy-800/40 p-6 sm:p-8 lg:p-10 overflow-hidden group transition-colors duration-300 hover:border-amber-500/30"
              data-testid={`process-step-${i + 1}`}
            >
              <div className="step-number">{s.n}</div>
              <h3 className="mt-4 font-display font-bold text-white text-xl sm:text-2xl tracking-tight">
                {s.title}
              </h3>
              <p className="mt-3 text-white/65 leading-relaxed text-sm sm:text-base">{s.desc}</p>
              <div className="mt-6 h-px bg-gradient-to-r from-amber-400/40 to-transparent" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 sm:mt-16 rounded-3xl border border-amber-500/25 bg-gradient-to-br from-amber-500/[0.07] to-transparent p-6 sm:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
          data-testid="process-cta-block"
        >
          <div className="flex items-start gap-4">
            <span className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 inline-flex items-center justify-center text-amber-400 flex-shrink-0">
              <ShieldCheck size={20} />
            </span>
            <div>
              <h3 className="font-display font-bold text-white text-xl sm:text-2xl">
                Backed by a money-back guarantee.
              </h3>
              <p className="mt-2 text-white/65 text-sm sm:text-base max-w-2xl leading-relaxed">
                Let us help you find the right talent so you can focus on growing your business. Need a specific role we don't list? We can source it.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
            <Button
              onClick={onInquireVA}
              variant="outline"
              className="bg-transparent border-white/15 text-white hover:bg-white/5 hover:text-white rounded-full px-6"
              data-testid="process-inquire-va-btn"
            >
              Get Talent Now
            </Button>
            <Button
              onClick={onInquireTeam}
              className="bg-amber-500 hover:bg-amber-600 text-navy-900 font-semibold rounded-full px-6 amber-glow"
              data-testid="process-inquire-team-btn"
            >
              Inquire Talents Team Now
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Process;
