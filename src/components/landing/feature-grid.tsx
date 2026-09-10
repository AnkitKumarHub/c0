"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion, useInView } from "motion/react";
import { ArrowUpRight, Code2 } from "lucide-react";

type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.23, 1, 0.32, 1];

/* ─── Animated Terminal Visual ──────────────────────────────── */
function TerminalVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const reduce = useReducedMotion();
  const [lines, setLines] = useState(0);

  const terminalLines = [
    { prefix: "➜", text: " ~ npm install", color: "text-emerald-500" },
    { prefix: "", text: "added 124 packages in 2s", color: "text-zinc-500", dim: true },
    { prefix: "➜", text: " ~ npm run dev", color: "text-emerald-500" },
    { prefix: "✔", text: " ready on port 3000", color: "text-blue-400" },
    { prefix: "➜", text: " ~ agent writing...", color: "text-emerald-500" },
  ];

  useEffect(() => {
    if (!inView || reduce) { if (reduce && inView) setLines(terminalLines.length); return; }
    if (lines >= terminalLines.length) return;
    const t = setTimeout(() => setLines(l => l + 1), lines === 0 ? 400 : 600);
    return () => clearTimeout(t);
  }, [inView, lines, reduce, terminalLines.length]);

  return (
    <div ref={ref} className="h-full w-full rounded-t-xl border-x border-t border-zinc-800 bg-zinc-950 p-4">
      <div className="mb-3 flex items-center gap-1.5">
        <div className="h-2 w-2 rounded-full bg-red-500/60" />
        <div className="h-2 w-2 rounded-full bg-yellow-500/60" />
        <div className="h-2 w-2 rounded-full bg-green-500/60" />
      </div>
      <div className="space-y-1.5 font-mono text-[11px]">
        {terminalLines.slice(0, lines).map((line, i) => (
          <motion.p
            key={i}
            initial={reduce ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: line.dim ? 0.6 : 1, x: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className={line.color}
          >
            {line.prefix && <span className="text-emerald-500">{line.prefix}</span>}
            {line.text}
          </motion.p>
        ))}
        {lines > 0 && lines < terminalLines.length && (
          <span className="inline-block h-3 w-1.5 animate-pulse bg-zinc-500" />
        )}
      </div>
    </div>
  );
}

/* ─── Animated Split Preview Visual ─────────────────────────── */
function SplitPreviewVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) { setPhase(3); return; }
    if (phase >= 3) return;
    const t = setTimeout(() => setPhase(p => p + 1), phase === 0 ? 300 : 500);
    return () => clearTimeout(t);
  }, [inView, phase, reduce]);

  /* Mini code lines with syntax colors */
  const codeLines = [
    { tokens: [{ t: "import ", c: "text-pink-400" }, { t: "{ Card }", c: "text-zinc-300" }] },
    { tokens: [{ t: "import ", c: "text-pink-400" }, { t: "{ Button }", c: "text-zinc-300" }] },
    { tokens: [] },
    { tokens: [{ t: "export function ", c: "text-blue-400" }, { t: "Hero", c: "text-yellow-200" }, { t: "() {", c: "text-zinc-400" }] },
    { tokens: [{ t: "  return ", c: "text-pink-400" }, { t: "(", c: "text-zinc-400" }] },
    { tokens: [{ t: "    <Card>", c: "text-zinc-500" }] },
    { tokens: [{ t: "      <h1>", c: "text-zinc-500" }, { t: "Hello", c: "text-zinc-300" }, { t: "</h1>", c: "text-zinc-500" }] },
    { tokens: [{ t: "    </Card>", c: "text-zinc-500" }] },
  ];

  return (
    <div ref={ref} className="flex h-full w-full overflow-hidden rounded-t-xl border-x border-t border-zinc-800 bg-zinc-950">
      {/* Code side */}
      <div className="flex w-1/2 flex-col border-r border-zinc-800/50 p-2.5">
        <div className="mb-2 flex items-center gap-1.5 text-[8px] text-zinc-600">
          <Code2 className="size-2.5" />
          Hero.tsx
        </div>
        <div className="space-y-0.5 font-mono text-[9px] leading-[14px]">
          {codeLines.slice(0, phase > 0 ? codeLines.length : 0).map((line, i) => (
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05, ease: EASE_OUT }}
              className={line.tokens.length === 0 ? "h-[14px]" : ""}
            >
              {line.tokens.map((tok, j) => (
                <span key={j} className={tok.c}>{tok.t}</span>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
      {/* Preview side - rendered card */}
      <div className="flex w-1/2 flex-col items-center justify-center bg-zinc-900/30 p-3">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          animate={phase >= 2 ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className="w-full max-w-[100px] overflow-hidden rounded-lg border border-zinc-700/50 bg-zinc-800/50"
        >
          <div className="space-y-1 p-2.5">
            <span className="block text-[7px] font-bold text-white">Hello World</span>
            <span className="block text-[5px] leading-[7px] text-zinc-500">
              A simple card component rendered from your code.
            </span>
          </div>
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={phase >= 3 ? { opacity: 1 } : {}}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="border-t border-zinc-700/30 px-2.5 py-1.5"
          >
            <div className="rounded bg-white py-[2px] text-center text-[6px] font-medium text-zinc-950">
              Click me
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Animated Chat Iteration Visual ────────────────────────── */
function ChatIterationVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const reduce = useReducedMotion();
  const [msgs, setMsgs] = useState(0);

  const messages = [
    { side: "right" as const, text: "Make it dark mode." },
    { side: "left" as const, text: "Updated the theme to dark." },
    { side: "right" as const, text: "Add a gradient button." },
    { side: "left" as const, text: "Applying gradient..." },
  ];

  useEffect(() => {
    if (!inView) return;
    if (reduce) { setMsgs(messages.length); return; }
    if (msgs >= messages.length) return;
    const t = setTimeout(() => setMsgs(m => m + 1), msgs === 0 ? 400 : 800);
    return () => clearTimeout(t);
  }, [inView, msgs, reduce, messages.length]);

  return (
    <div ref={ref} className="flex h-full w-full flex-col justify-end gap-2 rounded-t-xl border-x border-t border-zinc-800 bg-zinc-950 p-3">
      {messages.slice(0, msgs).map((msg, i) => (
        <motion.div
          key={i}
          initial={reduce ? false : { opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
          className={
            msg.side === "right"
              ? "max-w-[80%] self-end rounded-2xl rounded-tr-sm bg-zinc-800 px-3 py-1.5 text-[10px] text-zinc-300"
              : "max-w-[85%] self-start rounded-2xl rounded-tl-sm border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-[10px] text-zinc-400"
          }
        >
          {i === msgs - 1 && msg.side === "left" ? (
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-white/20" />
              {msg.text}
            </span>
          ) : (
            msg.text
          )}
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Feature data ──────────────────────────────────────────── */
const features = [
  {
    title: "Sandboxed AI Agent",
    desc: "Your code runs in an isolated cloud sandbox. No local setup, no risk to your machine.",
    Visual: TerminalVisual,
  },
  {
    title: "Live Preview & Code",
    desc: "Watch your app come to life in real-time. Browse and edit the generated source.",
    Visual: SplitPreviewVisual,
  },
  {
    title: "Multi-turn Iteration",
    desc: "Refine with follow-up prompts. The agent remembers your full conversation context.",
    Visual: ChatIterationVisual,
  },
];

/* ─── Main component ────────────────────────────────────────── */
export function FeatureGrid() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20, scale: prefersReducedMotion ? 1 : 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: EASE_OUT } 
    },
  };

  return (
    <section id="features" className="bg-zinc-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="mb-12 flex flex-col gap-4"
        >
          <h2 className="font-heading text-4xl font-medium text-white md:text-5xl">
            Everything you need to ship faster
          </h2>
          <p className="max-w-[65ch] text-lg text-zinc-400">
            A complete suite of tools to take you from a single prompt to a fully functional application.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {features.map((feature, idx) => {
            const Visual = feature.Visual;
            return (
              <motion.div 
                key={idx}
                variants={itemVariants}
                className="group relative flex h-[400px] flex-col overflow-hidden rounded-3xl border border-zinc-800/50 bg-zinc-900/50 transition-colors hover:border-zinc-700"
              >
                <div className="relative h-[60%] w-full px-6 pt-6">
                  <Visual />
                  <div className="absolute bottom-0 left-0 h-16 w-full bg-gradient-to-t from-zinc-900/50 to-transparent" />
                </div>
                
                <div className="flex h-[40%] flex-col justify-end p-6 pt-0">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-heading text-xl font-medium text-white">{feature.title}</h3>
                    <ArrowUpRight className="h-5 w-5 text-zinc-600 transition-colors group-hover:text-zinc-300" />
                  </div>
                  <p className="line-clamp-2 text-sm text-zinc-400">{feature.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
