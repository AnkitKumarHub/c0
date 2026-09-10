"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { C0Logo } from "@/components/brand/c0-logo";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4">
        <nav
          className={cn(
            "mx-auto mt-4 flex h-14 max-w-5xl items-center justify-between rounded-2xl border px-5",
            /* Always glass — backdrop-blur is constant so content underneath bleeds through */
            "backdrop-blur-xl transition-all duration-500 ease-out",
            scrolled
              ? "border-white/[0.06] bg-zinc-900/50 shadow-lg shadow-black/30"
              : "border-white/[0.04] bg-zinc-900/30"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <C0Logo className="gap-2" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition-colors duration-150 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/sign-in"
              className="text-sm text-zinc-400 transition-colors duration-150 hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/sign-in"
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition-all duration-150 hover:bg-zinc-200 active:scale-[0.97]"
            >
              Start Building
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex size-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:text-white md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-zinc-950/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col items-center justify-center gap-6 pt-24">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className="text-2xl font-medium text-white"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: navLinks.length * 0.06 }}
                className="flex flex-col items-center gap-4 pt-6"
              >
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="text-lg text-zinc-400"
                >
                  Log in
                </Link>
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full bg-white px-6 py-3 text-base font-medium text-zinc-950"
                >
                  Start Building
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
