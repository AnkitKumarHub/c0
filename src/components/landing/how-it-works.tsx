"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion, useInView } from "motion/react";
import { Terminal, Sparkles, Rocket } from "lucide-react";

type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.23, 1, 0.32, 1];

/* ─── Step 1: Typing prompt visual ────────────────────────────── */
function PromptVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const reduce = useReducedMotion();
  const [text, setText] = useState("");
  const fullText = "Build a landing page with auth...";

  useEffect(() => {
    if (!inView || reduce) { if (reduce && inView) setText(fullText); return; }
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setText(fullText.slice(0, i));
      if (i >= fullText.length) clearInterval(interval);
    }, 45);
    return () => clearInterval(interval);
  }, [inView, reduce]);

  return (
    <div ref={ref} className="flex h-32 w-full items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 p-4">
      <div className="flex w-full items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2">
        <Sparkles className="h-4 w-4 shrink-0 text-zinc-400" />
        <span className="text-sm text-zinc-400">{text}</span>
        <motion.div
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="h-4 w-0.5 shrink-0 bg-zinc-400"
        />
      </div>
    </div>
  );
}

/* ─── Step 2: Terminal output visual ──────────────────────────── */
function TerminalVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const reduce = useReducedMotion();
  const [lines, setLines] = useState(0);

  const termLines = [
    { text: "$ agent start", color: "text-zinc-500" },
    { text: "> creating layout.tsx...", color: "text-zinc-400" },
    { text: "> writing components...", color: "text-zinc-400" },
    { text: "✔ compiled in 240ms", color: "text-emerald-400" },
  ];

  useEffect(() => {
    if (!inView) return;
    if (reduce) { setLines(termLines.length); return; }
    if (lines >= termLines.length) return;
    const t = setTimeout(() => setLines(l => l + 1), lines === 0 ? 400 : 600);
    return () => clearTimeout(t);
  }, [inView, lines, reduce, termLines.length]);

  return (
    <div ref={ref} className="flex h-32 w-full flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 p-4">
      <div className="mb-2 flex items-center gap-1.5 border-b border-zinc-800/50 pb-2">
        <div className="h-2 w-2 rounded-full bg-red-500/60" />
        <div className="h-2 w-2 rounded-full bg-yellow-500/60" />
        <div className="h-2 w-2 rounded-full bg-green-500/60" />
      </div>
      <div className="flex flex-col gap-1 font-mono text-[10px]">
        {termLines.slice(0, lines).map((line, i) => (
          <motion.div
            key={i}
            initial={reduce ? false : { opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            className={line.color}
          >
            {line.text}
          </motion.div>
        ))}
        {lines > 0 && lines < termLines.length && (
          <span className="inline-block h-2.5 w-1 animate-pulse bg-zinc-500" />
        )}
      </div>
    </div>
  );
}

/* ─── Step 3: Browser preview visual ──────────────────────────── */
function BrowserVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const reduce = useReducedMotion();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!inView) return;
    if (reduce) { setLoaded(true); return; }
    const t = setTimeout(() => setLoaded(true), 800);
    return () => clearTimeout(t);
  }, [inView, reduce]);

  return (
    <div ref={ref} className="flex h-32 w-full flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900 px-2.5 py-1.5">
        <div className="flex gap-1">
          <div className="size-1.5 rounded-full bg-red-500/60" />
          <div className="size-1.5 rounded-full bg-yellow-500/60" />
          <div className="size-1.5 rounded-full bg-green-500/60" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5">
            <div className="size-1.5 rounded-full bg-green-400/60" />
            <span className="text-[8px] text-zinc-500">my-app.vercel.app</span>
          </div>
        </div>
      </div>
      {/* Page content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {loaded ? (
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="flex flex-1 flex-col"
          >
            {/* Mini navbar */}
            <div className="flex items-center justify-between border-b border-zinc-800/50 px-3 py-1">
              <span className="text-[7px] font-bold text-white/80">myApp</span>
              <div className="flex gap-2">
                <span className="text-[6px] text-zinc-500">Features</span>
                <span className="text-[6px] text-zinc-500">Pricing</span>
                <span className="text-[6px] text-zinc-500">Docs</span>
              </div>
            </div>
            {/* Hero area */}
            <div className="flex flex-1 flex-col items-center justify-center gap-0.5 px-3 py-1.5">
              <span className="text-[8px] font-bold text-white">Build faster with AI</span>
              <span className="text-[5px] text-zinc-500">Ship production apps in minutes</span>
              <div className="mt-1.5 rounded-full bg-white px-3 py-[3px]">
                <span className="text-[6px] font-medium text-zinc-950">Get Started</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-1 items-center justify-center gap-1.5">
            <div className="size-3 animate-spin rounded-full border-[1.5px] border-zinc-700 border-t-zinc-400" />
            <span className="text-[8px] text-zinc-500">Deploying...</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Steps config ────────────────────────────────────────────── */
const steps = [
  {
    num: "01",
    title: "Describe",
    desc: "Type a prompt to describe what you want to build.",
    icon: Sparkles,
    Visual: PromptVisual,
  },
  {
    num: "02",
    title: "Generate",
    desc: "AI agent builds the app in a secure cloud sandbox.",
    icon: Terminal,
    Visual: TerminalVisual,
  },
  {
    num: "03",
    title: "Ship",
    desc: "Live app ready to preview, edit, and iterate on.",
    icon: Rocket,
    Visual: BrowserVisual,
  },
];

/* ─── Main component ──────────────────────────────────────────── */
export function HowItWorks() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20, scale: prefersReducedMotion ? 1 : 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6, ease: EASE_OUT } 
    },
  };

  return (
    <section id="how-it-works" className="overflow-hidden bg-zinc-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex flex-col items-center text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="mb-4 font-heading text-4xl font-medium text-white md:text-5xl"
          >
            How c0 works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="max-w-[65ch] text-lg text-zinc-400"
          >
            From idea to full-stack application in three simple steps. No local setup required.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {/* Desktop dashed line connector */}
          <div className="absolute left-0 top-[40%] hidden w-full -translate-y-1/2 border-t border-dashed border-zinc-800 md:block" />

          {steps.map((step) => {
            const Icon = step.icon;
            const Visual = step.Visual;
            return (
              <motion.div 
                key={step.num}
                variants={itemVariants}
                className="relative z-10 flex flex-col rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-6 backdrop-blur-sm"
              >
                <div className="mb-6"><Visual /></div>
                
                <div className="mt-auto flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-zinc-600">{step.num}</span>
                    <h3 className="flex items-center gap-2 font-heading text-xl font-medium text-white">
                      <Icon className="h-4 w-4 text-zinc-400" />
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm text-zinc-400">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
