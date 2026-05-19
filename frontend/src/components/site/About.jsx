import React from "react";
import { motion } from "framer-motion";
import { Target, Compass } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: "easeOut" },
};

export const About = () => {
  return (
    <section id="about" className="relative py-20 sm:py-28 lg:py-32" data-testid="about-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div {...fadeUp} className="max-w-2xl">
          <div className="eyebrow text-hl dark:text-amber-400">Who we are</div>
          <h2 className="h-section mt-3 text-white">
            We build the bridge between <span className="text-amber-400">talent</span> and&nbsp;
            <span className="text-amber-400">ambition</span>.
          </h2>
          <p className="mt-5 text-white/65 text-base sm:text-lg leading-relaxed">
            We bridge talent by recruiting & developing skilled individuals, matching them w/organizations
            that need specialized online services & enabling smooth collaboration from onboarding to execution.
          </p>
        </motion.div>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          {/* Mission */}
          <motion.article
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.05 }}
            className="md:col-span-7 relative rounded-3xl border border-white/10 bg-navy-800/50 p-6 sm:p-9 overflow-hidden group transition-colors duration-300 hover:border-amber-500/30"
            data-testid="mission-card"
          >
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-amber-500/20 blur-3xl opacity-60 group-hover:opacity-80 transition" />
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 inline-flex items-center justify-center text-amber-400">
                <Target size={18} />
              </span>
              <div className="card-eyebrow text-hl dark:text-amber-400">Mission</div>
            </div>
            <h3 className="mt-5 font-display text-2xl sm:text-3xl text-white tracking-tight">
              Operational excellence for clients and careers.
            </h3>
            <p className="mt-4 text-white/65 leading-relaxed">

            </p>
            <p className="mt-3 text-white/65 leading-relaxed">
              We prioritize professionalism, accountability & performance helping clients achieve operational excellence, building career pathways for modern digital talent.
            </p>
          </motion.article>

          {/* Vision */}
          <motion.article
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.15 }}
            className="md:col-span-5 relative rounded-3xl border border-white/10 bg-gradient-to-br from-navy-800/70 to-navy-900/70 p-6 sm:p-9 overflow-hidden transition-colors duration-300 hover:border-amber-500/30"
            data-testid="vision-card"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 inline-flex items-center justify-center text-amber-400">
                <Compass size={18} />
              </span>
              <div className="card-eyebrow text-hl dark:text-amber-400">Vision</div>
            </div>
            <p className="mt-4 text-white/65 leading-relaxed">
              To become a trusted partner that helps businesses scale with reliable remote professionals, while providing freelancers with stable, growth-oriented career opportunities
            </p>

            <div className="mt-7 pt-6 border-t border-white/10 grid grid-cols-3 gap-3">
              {["Professional", "Accountable", "Performance"].map((tag) => (
                <div
                  key={tag}
                  className="text-[12px] uppercase tracking-[0.18em] text-hl dark:text-amber-400 text-center"
                >
                  {tag}
                  {tag !== "Performance" && <>&nbsp;&nbsp;|</>}
                </div>
              ))}
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
};

export default About;
