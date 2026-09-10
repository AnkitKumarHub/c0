"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { ProductPreview } from "./product-preview";

export function HeroSection() {
  const reduce = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] } 
    },
  };

  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-800/20 blur-[120px] opacity-50 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={reduce ? { opacity: 1 } : "hidden"}
          animate="visible"
          variants={containerVariants}
          className="flex flex-col items-center text-center md:items-start md:text-left"
        >
          {/* Eyebrow */}
          <motion.div variants={itemVariants} className="mb-6 flex items-center rounded-full border border-zinc-800/80 bg-zinc-900/50 px-4 py-1.5 backdrop-blur-sm">
            <Sparkles className="mr-2 size-4 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-300">Introducing chai0</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            variants={itemVariants}
            className="mb-6 max-w-4xl text-5xl font-medium tracking-tight text-white md:text-7xl lg:text-8xl"
          >
            Describe it.<br />
            <span className="text-zinc-500">Build it. Ship it.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p 
            variants={itemVariants}
            className="mb-10 max-w-[65ch] text-lg text-zinc-400 md:text-xl"
          >
            The AI-powered web app generator that turns your plain text descriptions into production-ready React components and full applications.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col items-center gap-4 sm:flex-row md:justify-start"
          >
            <Link
              href="/sign-in"
              className="flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-medium text-zinc-950 transition-transform duration-150 active:scale-[0.97]"
            >
              Start Building Free
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-full px-6 py-3.5 text-base font-medium text-zinc-400 transition-colors duration-150 hover:text-white"
            >
              See how it works
            </Link>
          </motion.div>
        </motion.div>

        {/* Product Preview Component */}
        <ProductPreview />
      </div>
    </section>
  );
}
