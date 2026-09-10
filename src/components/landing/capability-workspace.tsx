"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "motion/react";
import { MessageSquare, LayoutTemplate, Code } from "lucide-react";

type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.23, 1, 0.32, 1];

/* ─── Chat messages ───────────────────────────────────────────── */
const CHAT_MESSAGES = [
  { side: "user" as const, text: "Build a landing page with a hero section." },
  { side: "ai" as const, text: "I'll create a modern hero with a gradient background and CTA buttons.", hasAction: true },
  { side: "user" as const, text: "Make it dark mode." },
  { side: "ai" as const, text: "Updated to dark theme with zinc surfaces.", hasAction: true },
];

/* ─── File tree entries ───────────────────────────────────────── */
const FILE_TREE = [
  { name: "src/", isDir: true, depth: 0 },
  { name: "app/", isDir: true, depth: 1 },
  { name: "layout.tsx", isDir: false, depth: 2, edited: true },
  { name: "page.tsx", isDir: false, depth: 2, active: true },
  { name: "globals.css", isDir: false, depth: 2 },
  { name: "components/", isDir: true, depth: 1 },
  { name: "Hero.tsx", isDir: false, depth: 2 },
];

/* ─── Preview states (light -> dark transition) ───────────────── */
function PreviewContent({ darkMode }: { darkMode: boolean }) {
  return (
    <motion.div
      key={darkMode ? "dark" : "light"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
      className={`flex flex-1 flex-col items-center justify-center p-8 text-center transition-colors duration-500 ${
        darkMode ? "bg-zinc-950" : "bg-zinc-100"
      }`}
    >
      <div className={`mb-3 h-10 w-10 rounded-full ${darkMode ? "bg-white" : "bg-zinc-900"}`} />
      <h3 className={`mb-1 text-lg font-bold ${darkMode ? "text-white" : "text-zinc-900"}`}>
        Welcome
      </h3>
      <p className={`max-w-[160px] text-xs ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
        Your landing page is ready.
      </p>
      <div className={`mt-4 rounded-full px-4 py-1.5 text-xs font-medium ${
        darkMode ? "bg-white text-zinc-950" : "bg-zinc-900 text-white"
      }`}>
        Get Started
      </div>
    </motion.div>
  );
}

export function CapabilityWorkspace() {
  const prefersReducedMotion = useReducedMotion();
  const mockupRef = useRef<HTMLDivElement>(null);
  const inView = useInView(mockupRef, { once: true, margin: "-80px" });
  
  const [visibleMsgs, setVisibleMsgs] = useState(0);
  const [visibleFiles, setVisibleFiles] = useState(0);
  const [isDark, setIsDark] = useState(false);

  // Chat messages appearing
  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion) {
      setVisibleMsgs(CHAT_MESSAGES.length);
      setVisibleFiles(FILE_TREE.length);
      setIsDark(true);
      return;
    }
    if (visibleMsgs >= CHAT_MESSAGES.length) return;
    const delay = visibleMsgs === 0 ? 500 : 900;
    const t = setTimeout(() => {
      setVisibleMsgs(m => m + 1);
      // Trigger dark mode when 3rd message appears ("Make it dark mode")
      if (visibleMsgs === 2) {
        setTimeout(() => setIsDark(true), 600);
      }
    }, delay);
    return () => clearTimeout(t);
  }, [inView, visibleMsgs, prefersReducedMotion]);

  // File tree appearing
  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion) return;
    if (visibleFiles >= FILE_TREE.length) return;
    const t = setTimeout(() => setVisibleFiles(f => f + 1), visibleFiles === 0 ? 300 : 120);
    return () => clearTimeout(t);
  }, [inView, visibleFiles, prefersReducedMotion]);

  return (
    <section id="capability-workspace" className="bg-zinc-950 py-24">
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
              <div className="h-2 w-2 rounded-full bg-blue-400" />
              <span className="text-sm font-medium text-zinc-400">Workspace</span>
            </div>
            
            <h2 className="font-heading text-4xl font-medium text-white md:text-5xl">
              Everything in one view
            </h2>
            
            <p className="max-w-[65ch] text-lg text-zinc-400">
              The split workspace gives you chat, live preview, and source code side by side. Send follow-ups, watch changes appear instantly.
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
            <div className="flex h-[500px] w-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 md:flex-row">
              {/* Chat Panel */}
              <div className="flex w-full flex-col border-b border-zinc-800 bg-zinc-950/50 md:w-1/4 md:border-b-0 md:border-r">
                <div className="flex items-center gap-2 border-b border-zinc-800 p-3">
                  <MessageSquare className="h-4 w-4 text-zinc-400" />
                  <span className="text-xs font-medium text-zinc-300">Chat</span>
                </div>
                <div className="flex flex-1 flex-col justify-end space-y-3 overflow-hidden p-3">
                  <AnimatePresence>
                    {CHAT_MESSAGES.slice(0, visibleMsgs).map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3, ease: EASE_OUT }}
                        className={
                          msg.side === "user"
                            ? "max-w-[90%] self-end rounded-2xl rounded-tr-sm bg-zinc-800 p-2.5 text-xs text-zinc-200"
                            : "max-w-[90%] self-start space-y-2 rounded-2xl rounded-tl-sm border border-zinc-800 bg-zinc-900 p-2.5 text-xs text-zinc-400"
                        }
                      >
                        <p>{msg.text}</p>
                        {msg.side === "ai" && msg.hasAction && (
                          <div className="flex items-center gap-1.5 rounded bg-black/40 p-1.5 text-[10px]">
                            <Code className="h-2.5 w-2.5 text-blue-400" />
                            <span>Edited page.tsx</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {visibleMsgs > 0 && visibleMsgs < CHAT_MESSAGES.length && (
                    <div className="flex items-center gap-1.5 self-start pl-1">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" style={{ animationDelay: "300ms" }} />
                    </div>
                  )}
                </div>
              </div>

              {/* Preview Panel - transitions from light to dark */}
              <div className="flex w-full flex-col border-b border-zinc-800 md:w-2/4 md:border-b-0 md:border-r">
                <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 p-3">
                  <div className="flex items-center gap-2">
                    <LayoutTemplate className="h-4 w-4 text-zinc-400" />
                    <span className="text-xs font-medium text-zinc-300">Preview</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-zinc-700" />
                    <div className="h-2 w-2 rounded-full bg-zinc-700" />
                    <div className="h-2 w-2 rounded-full bg-zinc-700" />
                  </div>
                </div>
                <AnimatePresence mode="wait">
                  <PreviewContent darkMode={isDark} />
                </AnimatePresence>
              </div>

              {/* Code Panel - file tree with stagger */}
              <div className="flex w-full flex-col bg-zinc-950 md:w-1/4">
                <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900/30 p-3">
                  <Code className="h-4 w-4 text-zinc-400" />
                  <span className="text-xs font-medium text-zinc-300">Explorer</span>
                </div>
                <div className="flex-1 p-3 font-mono text-xs text-zinc-400">
                  <div className="space-y-1.5">
                    {FILE_TREE.slice(0, visibleFiles).map((file, i) => (
                      <motion.div
                        key={i}
                        initial={prefersReducedMotion ? false : { opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, ease: EASE_OUT }}
                        style={{ paddingLeft: `${file.depth * 12}px` }}
                        className={`flex items-center gap-1.5 rounded px-1.5 py-0.5 ${
                          file.active ? "bg-zinc-800/50 text-white" : ""
                        } ${file.edited ? "text-orange-300" : ""}`}
                      >
                        {file.isDir ? (
                          <>
                            <span className="text-zinc-500">▾</span>
                            <span className="text-blue-400">{file.name}</span>
                          </>
                        ) : (
                          <>
                            <Code className="h-3 w-3 shrink-0" />
                            <span>{file.name}</span>
                            {file.edited && (
                              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-orange-400" />
                            )}
                          </>
                        )}
                      </motion.div>
                    ))}
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
