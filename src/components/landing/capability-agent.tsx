"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion, useInView } from "motion/react";
import { Terminal, Code2 } from "lucide-react";

type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.23, 1, 0.32, 1];

/* ─── Terminal lines config ───────────────────────────────────── */
interface TermLine { text: string; color: string; indent?: boolean }

const TERM_LINES: TermLine[] = [
  { text: "$ agent run task", color: "text-zinc-500" },
  { text: "► Creating app structure...", color: "text-orange-400" },
  { text: "  Created package.json", color: "text-zinc-400", indent: true },
  { text: "  Created tsconfig.json", color: "text-zinc-400", indent: true },
  { text: "  Created next.config.ts", color: "text-zinc-400", indent: true },
  { text: "► Installing dependencies...", color: "text-orange-400" },
  { text: "  npm i react react-dom next", color: "text-zinc-400", indent: true },
  { text: "✔ Dependencies installed", color: "text-emerald-400" },
  { text: "► Writing components...", color: "text-orange-400" },
  { text: "  Writing Button.tsx", color: "text-zinc-400", indent: true },
];

/* ─── Code lines config ───────────────────────────────────────── */
interface CodeToken { text: string; color: string }
interface CodeLine { indent: number; tokens: CodeToken[] }

const CODE_LINES: CodeLine[] = [
  { indent: 0, tokens: [
    { text: "export function ", color: "text-purple-400" },
    { text: "Button", color: "text-blue-400" },
    { text: "({ children }) {", color: "text-zinc-300" },
  ]},
  { indent: 1, tokens: [
    { text: "return ", color: "text-purple-400" },
    { text: "(", color: "text-zinc-300" },
  ]},
  { indent: 2, tokens: [
    { text: "<button", color: "text-zinc-400" },
  ]},
  { indent: 3, tokens: [
    { text: "className", color: "text-orange-300" },
    { text: "=", color: "text-zinc-500" },
    { text: '"px-4 py-2 rounded-md"', color: "text-emerald-300" },
  ]},
  { indent: 3, tokens: [
    { text: "onClick", color: "text-orange-300" },
    { text: "=", color: "text-zinc-500" },
    { text: "{handleClick}", color: "text-zinc-300" },
  ]},
  { indent: 2, tokens: [
    { text: ">", color: "text-zinc-400" },
  ]},
  { indent: 3, tokens: [
    { text: "{children}", color: "text-zinc-300" },
  ]},
  { indent: 2, tokens: [
    { text: "</", color: "text-zinc-400" },
    { text: "button", color: "text-red-400" },
    { text: ">", color: "text-zinc-400" },
  ]},
  { indent: 1, tokens: [
    { text: ");", color: "text-zinc-300" },
  ]},
  { indent: 0, tokens: [
    { text: "}", color: "text-zinc-300" },
  ]},
];

export function CapabilityAgent() {
  const prefersReducedMotion = useReducedMotion();
  const mockupRef = useRef<HTMLDivElement>(null);
  const inView = useInView(mockupRef, { once: true, margin: "-80px" });
  
  const [termLines, setTermLines] = useState(0);
  const [codeLines, setCodeLines] = useState(0);

  // Terminal streaming
  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion) { setTermLines(TERM_LINES.length); setCodeLines(CODE_LINES.length); return; }
    if (termLines >= TERM_LINES.length) return;
    const delay = termLines === 0 ? 300 : termLines % 3 === 0 ? 400 : 200;
    const t = setTimeout(() => setTermLines(l => l + 1), delay);
    return () => clearTimeout(t);
  }, [inView, termLines, prefersReducedMotion]);

  // Code streaming (starts after terminal reaches line 8)
  useEffect(() => {
    if (!inView || prefersReducedMotion) return;
    if (termLines < 8) return;
    if (codeLines >= CODE_LINES.length) return;
    const t = setTimeout(() => setCodeLines(l => l + 1), 150);
    return () => clearTimeout(t);
  }, [inView, termLines, codeLines, prefersReducedMotion]);

  return (
    <section id="capability-agent" className="bg-zinc-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-16">
          <motion.div 
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-orange-500" />
              <span className="text-sm font-medium text-zinc-400">AI Agent</span>
            </div>
            
            <h2 className="font-heading text-4xl font-medium text-white md:text-5xl">
              An agent that writes, runs, and iterates
            </h2>
            
            <p className="max-w-[65ch] text-lg text-zinc-400">
              The agent acts like a real developer. It writes files, executes terminal commands, reads the output, and iterates to fix errors, all inside an isolated cloud sandbox.
            </p>
          </motion.div>

          <motion.div 
            ref={mockupRef}
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 40, scale: prefersReducedMotion ? 1 : 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="w-full overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-2 shadow-2xl"
          >
            <div className="flex h-[400px] w-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 md:flex-row">
              {/* Terminal Side */}
              <div className="flex flex-1 flex-col border-b border-zinc-800 md:border-b-0 md:border-r">
                <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900/50 px-4 py-2">
                  <Terminal className="h-4 w-4 text-zinc-400" />
                  <span className="text-xs font-medium text-zinc-400">Terminal</span>
                </div>
                <div className="flex-1 space-y-1 overflow-hidden bg-black/20 p-4 font-mono text-sm">
                  {TERM_LINES.slice(0, termLines).map((line, i) => (
                    <motion.p
                      key={i}
                      initial={prefersReducedMotion ? false : { opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, ease: EASE_OUT }}
                      className={`${line.color}${line.indent ? " pl-4" : ""}`}
                    >
                      {line.text}
                    </motion.p>
                  ))}
                  {termLines > 0 && termLines < TERM_LINES.length && (
                    <div className="flex items-center gap-2 pt-1 text-zinc-500">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
                      <span className="text-xs">Agent working...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Code Side */}
              <div className="flex flex-1 flex-col">
                <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900/50 px-4 py-2">
                  <Code2 className="h-4 w-4 text-zinc-400" />
                  <span className="text-xs font-medium text-zinc-400">Button.tsx</span>
                </div>
                <div className="flex-1 overflow-hidden bg-zinc-950 p-4 font-mono text-sm">
                  <div className="flex gap-3">
                    <div className="hidden select-none flex-col text-right text-zinc-700 sm:flex">
                      {CODE_LINES.slice(0, Math.max(codeLines, 1)).map((_, i) => (
                        <span key={i}>{i + 1}</span>
                      ))}
                    </div>
                    <div className="flex-1 space-y-0">
                      {CODE_LINES.slice(0, codeLines).map((line, i) => (
                        <motion.div
                          key={i}
                          initial={prefersReducedMotion ? false : { opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, ease: EASE_OUT }}
                          style={{ paddingLeft: `${line.indent * 16}px` }}
                        >
                          {line.tokens.map((token, j) => (
                            <span key={j} className={token.color}>{token.text}</span>
                          ))}
                        </motion.div>
                      ))}
                      {codeLines > 0 && codeLines < CODE_LINES.length && (
                        <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-zinc-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
