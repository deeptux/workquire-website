import React from "react";
import { motion } from "framer-motion";
import { Target, Compass } from "lucide-react";

/** Unsplash — free to use via hotlink; mission/vision themed. */
const CARD_BACKGROUNDS = {
  mission:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80",
  vision:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80",
};

const CardPhotoBg = ({ src }) => (
  <>
    <img
      src={src}
      alt=""
      className="absolute inset-0 h-full w-full object-cover scale-105 transition-transform duration-700 group-hover:scale-110"
      loading="lazy"
      aria-hidden="true"
    />
    {/* Light mode: airy sky wash + left→right light-blue gradient */}
    <div className="absolute inset-0 bg-[#B0E4FA]/28 dark:hidden" aria-hidden="true" />
    <div
      className="absolute inset-0 dark:hidden bg-[linear-gradient(90deg,rgba(176,228,250,0.94)_0%,rgba(176,228,250,0.8)_40%,rgba(176,228,250,0.5)_87%,rgba(176,228,250,0.15)_100%)]"
      aria-hidden="true"
    />
    {/* Dark mode: deep navy wash + left→right dark-blue gradient */}
    <div className="absolute inset-0 hidden dark:block bg-[#050338]/48" aria-hidden="true" />
    <div
      className="absolute inset-0 hidden dark:block bg-[linear-gradient(90deg,rgba(5,3,56,0.88)_0%,rgba(5,3,56,0.74)_42%,rgba(5,3,56,0.48)_80%,rgba(5,3,56,0.16)_100%)]"
      aria-hidden="true"
    />
    <div
      className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#B0E4FA]/35 to-transparent dark:from-[#050338]/38"
      aria-hidden="true"
    />
  </>
);

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
            className="on-image-card md:col-span-7 relative rounded-3xl border border-white/10 p-6 sm:p-9 overflow-hidden group transition-colors duration-300 hover:border-amber-500/30 min-h-[320px] sm:min-h-[360px]"
            data-testid="mission-card"
          >
            <CardPhotoBg src={CARD_BACKGROUNDS.mission} />
            <div className="relative z-10 max-w-[94%] sm:max-w-[90%]">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 inline-flex items-center justify-center text-amber-400 backdrop-blur-sm">
                  <Target size={18} />
                </span>
                <div className="card-eyebrow text-hl dark:text-amber-400">Mission</div>
              </div>
              <h3 className="mt-5 font-display text-2xl sm:text-3xl text-white tracking-tight">
                Operational excellence for clients & careers.
              </h3>
              <p className="mt-4 text-white/65 leading-relaxed">

              </p>
              <p className="mt-3 text-white/65 leading-relaxed">
                We prioritize professionalism, accountability & performance helping clients achieve operational excellence while building career pathways for modern digital talent.
              </p>
            </div>
          </motion.article>

          {/* Vision */}
          <motion.article
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.15 }}
            className="on-image-card md:col-span-5 relative rounded-3xl border border-white/10 p-6 sm:p-9 overflow-hidden group transition-colors duration-300 hover:border-amber-500/30 min-h-[320px] sm:min-h-[360px]"
            data-testid="vision-card"
          >
            <CardPhotoBg src={CARD_BACKGROUNDS.vision} />
            <div className="relative z-10 flex h-full flex-col max-w-[95%] sm:max-w-[90%]">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 inline-flex items-center justify-center text-amber-400 backdrop-blur-sm">
                  <Compass size={18} />
                </span>
                <div className="card-eyebrow text-hl dark:text-amber-400">Vision</div>
              </div>
              <p className="mt-4 text-white/65 leading-relaxed flex-1">
                To become a trusted partner that helps businesses scale w/reliable remote professionals, while providing freelancers w/stable, growth-oriented career opportunities
              </p>

              <div className="mt-7 pt-6 border-t border-white/15 grid grid-cols-3 gap-3">
                {["Professional", "Accountable", "Performance"].map((tag) => (
                  <div
                    key={tag}
                    className="text-[12px] uppercase tracking-[0.18em] text-[#080656] dark:text-amber-400 text-center"
                  >
                    {tag}
                    {tag !== "Performance" && <>&nbsp;|</>}
                  </div>
                ))}
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
};

export default About;
