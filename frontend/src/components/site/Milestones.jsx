import React from "react";
import { motion } from "framer-motion";

const items = [
  {
    year: "2021",
    title: "Founding year",
    desc:
      "WorkQuire was founded by referring talents to clients, friends, and family — helping businesses fill immediate needs through trusted connections.",
  },
  {
    year: "Growth",
    title: "Growing demand",
    desc:
      "Business owners increasingly needed social media managers, designers, video editors, web developers, virtual assistants, and other digital professionals.",
  },
  {
    year: "Network",
    title: "Freelance network growth",
    desc:
      "A strong and expanding freelance network was formed, creating access to skilled talents across multiple roles.",
  },
  {
    year: "Launch",
    title: "Formal launch",
    desc:
      "WorkQuire was established as a hiring agency to connect the right talent with the right businesses — focused on alignment, accountability, and performance.",
  },
];

export const Milestones = () => {
  return (
    <section className="relative py-20 sm:py-28" data-testid="milestones-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <div className="eyebrow">Milestones</div>
            <h2 className="h-section mt-3 text-white">From referrals to a <span className="text-amber-400">talent engine</span>.</h2>
          </div>
          <p className="text-white/55 max-w-md text-sm sm:text-base">
            Built on trusted connections — refined into a structured, accountable hiring system.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line on mobile (left), centered on desktop */}
          <div className="absolute top-0 bottom-0 left-4 md:left-1/2 md:-translate-x-1/2 w-px bg-gradient-to-b from-transparent via-amber-500/40 to-transparent" />

          <ul className="space-y-10 sm:space-y-14">
            {items.map((it, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <motion.li
                  key={it.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.05 }}
                  className="relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-12"
                  data-testid={`milestone-${idx}`}
                >
                  {/* Dot */}
                  <span className="absolute left-4 md:left-1/2 -translate-x-1/2 top-2 w-3 h-3 rounded-full bg-amber-400 ring-4 ring-amber-400/15" />

                  <div className={`${isLeft ? "md:pr-10 md:text-right" : "md:order-2 md:pl-10"}`}>
                    <div className="eyebrow !text-amber-400/90">{it.year}</div>
                    <h3 className="mt-2 font-display font-bold text-white text-xl sm:text-2xl">{it.title}</h3>
                  </div>
                  <div className={`${isLeft ? "md:order-2 md:pl-10" : "md:pr-10 md:text-right"} mt-2 md:mt-0`}>
                    <p className="text-white/65 leading-relaxed text-sm sm:text-base">{it.desc}</p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Milestones;
