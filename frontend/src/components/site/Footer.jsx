import React from "react";
import { Brand } from "./Brand";
import { Phone, Mail, AtSign } from "lucide-react";

export const Footer = ({ onInquireVA, onInquireTeam }) => {
  return (
    <footer
      className="relative pt-20 sm:pt-28 pb-10"
      style={{ background: "var(--bg-footer)" }}
      data-testid="site-footer"
    >
      <div className="gradient-divider absolute top-0 left-0 right-0" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-6">
            <div className="flex items-center gap-4 mb-2">
              <Brand asImage size="lg" />
              <Brand size="lg" />
            </div>
            <h3 className="mt-6 font-display text-3xl sm:text-5xl text-white font-bold tracking-tight max-w-xl leading-[0.95]">
              Work with <span className="text-hl dark:text-amber-400">confidence</span>.
            </h3>
            <p className="mt-5 text-white/55 max-w-md">
              People. Skills. Results. Truly assembled around your goals. Talk to us, we'll source the right talent for your business.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={onInquireVA}
                className="px-5 py-2.5 rounded-full border border-white/15 text-white hover:bg-white/5 transition text-sm"
                data-testid="footer-inquire-va-btn"
              >
                Inquire Talent Now
              </button>
              <button
                onClick={onInquireTeam}
                className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-navy-900 font-semibold transition text-sm"
                data-testid="footer-inquire-team-btn"
              >
                Inquire Talent Team Now
              </button>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="eyebrow !text-white/45">Contact</div>
            <ul className="mt-4 space-y-3 text-white/80 text-sm">
              <li className="flex items-center gap-3">
                <Phone size={14} className="text-amber-400" />
                <a href="tel:+639150423954" data-testid="footer-phone">+63 915 042 3954</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-amber-400" />
                <a href="mailto:workquire@gmail.com" data-testid="footer-email">workquire@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <AtSign size={14} className="text-amber-400" />
                <span data-testid="footer-social">@WorkQuire</span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="eyebrow !text-white/45">Explore</div>
            <ul className="mt-4 space-y-2 text-white/70 text-sm">
              <li><a href="#about" className="hover:text-amber-400 transition">About</a></li>
              <li><a href="#why" className="hover:text-amber-400 transition">Why Us</a></li>
              <li><a href="#talents" className="hover:text-amber-400 transition">Talents</a></li>
              <li><a href="#process" className="hover:text-amber-400 transition">Process</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4 items-center justify-between text-xs text-white/40">
          <span>© {new Date().getFullYear()} WorkQuire. All rights reserved.</span>
          <span className="tracking-[0.3em] uppercase text-amber-400/80">Work with confidence</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
