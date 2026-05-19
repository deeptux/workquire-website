import React, { useEffect, useState } from "react";
import { Brand } from "./Brand";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { label: "About", href: "#about" },
  { label: "Why Us", href: "#why" },
  { label: "Talents", href: "#talents" },
  { label: "Process", href: "#process" },
];

export const Navbar = ({ onInquireVA, onInquireTeam }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeAnd = (fn) => () => {
    setOpen(false);
    fn && fn();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-strong" : "bg-transparent"
      }`}
      data-testid="site-navbar"
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-10 h-16 sm:h-20">
        <a href="#top" className="flex items-center gap-2" data-testid="nav-logo">
          <Brand size="md" />
        </a>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="px-3 py-2 text-sm font-medium text-white/75 hover:text-amber-400 transition-colors"
                data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle className="mr-1" />
          <Button
            variant="ghost"
            onClick={onInquireVA}
            className="text-white hover:text-amber-400 hover:bg-white/5 rounded-full px-5"
            data-testid="nav-inquire-va-btn"
          >
            Get Talent Now
          </Button>
          <Button
            onClick={onInquireTeam}
            className="bg-amber-500 text-navy-900 hover:bg-amber-600 rounded-full px-5 font-semibold amber-glow"
            data-testid="nav-inquire-team-btn"
          >
            Inquire Talents Team Now
          </Button>
        </div>

        {/* Mobile toggle group */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/10 text-white bg-white/5"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            data-testid="nav-mobile-toggle"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`md:hidden glass-strong overflow-hidden transition-[max-height,opacity] duration-300 ${
          open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        }`}
        data-testid="nav-mobile-panel"
      >
        <div className="px-4 py-4 flex flex-col gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="px-3 py-3 rounded-lg text-base text-white/85 hover:bg-white/5 transition"
              data-testid={`mobile-nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {l.label}
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-2 pt-2 border-t border-white/10">
            <Button
              variant="outline"
              onClick={closeAnd(onInquireVA)}
              className="w-full bg-transparent border-white/15 text-white hover:bg-white/5 rounded-full"
              data-testid="mobile-inquire-va-btn"
            >
              Get Talent Now
            </Button>
            <Button
              onClick={closeAnd(onInquireTeam)}
              className="w-full bg-amber-500 text-navy-900 hover:bg-amber-600 rounded-full font-semibold"
              data-testid="mobile-inquire-team-btn"
            >
              Inquire Talents Team Now
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
