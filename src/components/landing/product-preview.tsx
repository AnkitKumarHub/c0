"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "motion/react";
import { Bot, Code2, Eye, User } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Animation config ────────────────────────────────────────── */
const CHAR_SPEED = 28;
const LINE_DELAY = 180;
const PAUSE_AFTER_USER = 600;
const PAUSE_AFTER_AI = 400;

const USER_MESSAGE = "Build a modern authentication screen with email and social login options.";
const AI_MESSAGE = "I'll create the auth screen with a dark theme, email input, and social login buttons for Google and GitHub.";

type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.23, 1, 0.32, 1];

/* ─── Code lines with syntax tokens (shorter lines, no wrapping) */
interface CodeToken { text: string; color: string }
type CodeLine = { indent: number; tokens: CodeToken[] };

const CODE_LINES: CodeLine[] = [
  { indent: 0, tokens: [
    { text: "import ", color: "text-pink-400" },
    { text: "{ useState }", color: "text-zinc-300" },
    { text: " from ", color: "text-pink-400" },
    { text: '"react"', color: "text-emerald-400" },
    { text: ";", color: "text-zinc-500" },
  ]},
  { indent: 0, tokens: [
    { text: "import ", color: "text-pink-400" },
    { text: "{ Button }", color: "text-zinc-300" },
    { text: " from ", color: "text-pink-400" },
    { text: '"@/ui/button"', color: "text-emerald-400" },
    { text: ";", color: "text-zinc-500" },
  ]},
  { indent: 0, tokens: [
    { text: "import ", color: "text-pink-400" },
    { text: "{ Input }", color: "text-zinc-300" },
    { text: " from ", color: "text-pink-400" },
    { text: '"@/ui/input"', color: "text-emerald-400" },
    { text: ";", color: "text-zinc-500" },
  ]},
  { indent: 0, tokens: [] },
  { indent: 0, tokens: [
    { text: "export function ", color: "text-blue-400" },
    { text: "AuthPage", color: "text-yellow-200" },
    { text: "() {", color: "text-zinc-300" },
  ]},
  { indent: 1, tokens: [
    { text: "const ", color: "text-blue-400" },
    { text: "[email, setEmail]", color: "text-zinc-300" },
    { text: " = ", color: "text-zinc-500" },
    { text: "useState", color: "text-yellow-200" },
    { text: '("");', color: "text-emerald-400" },
  ]},
  { indent: 1, tokens: [
    { text: "const ", color: "text-blue-400" },
    { text: "[loading, setLoading]", color: "text-zinc-300" },
    { text: " = ", color: "text-zinc-500" },
    { text: "useState", color: "text-yellow-200" },
    { text: "(", color: "text-zinc-300" },
    { text: "false", color: "text-orange-400" },
    { text: ");", color: "text-zinc-500" },
  ]},
  { indent: 0, tokens: [] },
  { indent: 1, tokens: [
    { text: "return ", color: "text-pink-400" },
    { text: "(", color: "text-zinc-300" },
  ]},
  { indent: 2, tokens: [
    { text: "<", color: "text-zinc-500" },
    { text: "div", color: "text-red-400" },
    { text: " className", color: "text-orange-300" },
    { text: "=", color: "text-zinc-500" },
    { text: '"flex min-h-screen"', color: "text-emerald-400" },
    { text: ">", color: "text-zinc-500" },
  ]},
  { indent: 3, tokens: [
    { text: "<", color: "text-zinc-500" },
    { text: "div", color: "text-red-400" },
    { text: " className", color: "text-orange-300" },
    { text: "=", color: "text-zinc-500" },
    { text: '"max-w-md rounded-2xl"', color: "text-emerald-400" },
    { text: ">", color: "text-zinc-500" },
  ]},
  { indent: 4, tokens: [
    { text: "<", color: "text-zinc-500" },
    { text: "h2", color: "text-red-400" },
    { text: ">", color: "text-zinc-500" },
    { text: "Welcome back", color: "text-zinc-300" },
    { text: "</", color: "text-zinc-500" },
    { text: "h2", color: "text-red-400" },
    { text: ">", color: "text-zinc-500" },
  ]},
  { indent: 4, tokens: [
    { text: "<", color: "text-zinc-500" },
    { text: "Input", color: "text-blue-400" },
    { text: " placeholder", color: "text-orange-300" },
    { text: "=", color: "text-zinc-500" },
    { text: '"Email"', color: "text-emerald-400" },
    { text: " />", color: "text-zinc-500" },
  ]},
  { indent: 4, tokens: [
    { text: "<", color: "text-zinc-500" },
    { text: "Button", color: "text-blue-400" },
    { text: ">", color: "text-zinc-500" },
    { text: "Sign in", color: "text-zinc-300" },
    { text: "</", color: "text-zinc-500" },
    { text: "Button", color: "text-blue-400" },
    { text: ">", color: "text-zinc-500" },
  ]},
  { indent: 3, tokens: [
    { text: "</", color: "text-zinc-500" },
    { text: "div", color: "text-red-400" },
    { text: ">", color: "text-zinc-500" },
  ]},
  { indent: 2, tokens: [
    { text: "</", color: "text-zinc-500" },
    { text: "div", color: "text-red-400" },
    { text: ">", color: "text-zinc-500" },
  ]},
  { indent: 1, tokens: [
    { text: ");", color: "text-zinc-300" },
  ]},
  { indent: 0, tokens: [
    { text: "}", color: "text-zinc-300" },
  ]},
];

/* ─── Typing hook ─────────────────────────────────────────────── */
function useTypewriter(text: string, speed: number, startTyping: boolean) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!startTyping) { setDisplayed(""); setDone(false); return; }
    let i = 0;
    setDisplayed("");
    setDone(false);
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(interval); setDone(true); }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, startTyping]);

  return { displayed, done };
}

/* ─── Preview mockup (rendered auth component) ────────────────── */
function PreviewPane() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-950 p-8">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-white">
            <Bot className="size-6 text-zinc-950" />
          </div>
          <h2 className="text-xl font-bold text-white">Welcome back</h2>
          <p className="mt-1 text-sm text-zinc-400">Sign in to your account</p>
        </div>
        <div className="space-y-3">
          <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2.5 text-sm text-zinc-500">
            Email address
          </div>
          <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2.5 text-sm text-zinc-500">
            Password
          </div>
          <div className="rounded-lg bg-white py-2.5 text-center text-sm font-medium text-zinc-950">
            Sign in
          </div>
        </div>
        <div className="relative flex items-center gap-3">
          <div className="h-px flex-1 bg-zinc-800" />
          <span className="text-xs text-zinc-500">or</span>
          <div className="h-px flex-1 bg-zinc-800" />
        </div>
        <div className="flex gap-3">
          <div className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/30 py-2 text-xs text-zinc-300">
            Google
          </div>
          <div className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/30 py-2 text-xs text-zinc-300">
            GitHub
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────── */
export function ProductPreview() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState<"preview" | "code">("code");

  // Animation sequence state
  const [phase, setPhase] = useState<"idle" | "user-typing" | "ai-typing" | "code-streaming" | "done">("idle");
  const [visibleCodeLines, setVisibleCodeLines] = useState(0);

  useEffect(() => {
    if (isInView && phase === "idle") setPhase("user-typing");
  }, [isInView, phase]);

  const { displayed: userText, done: userDone } = useTypewriter(
    USER_MESSAGE, reduce ? 0 : CHAR_SPEED,
    phase === "user-typing" || phase === "ai-typing" || phase === "code-streaming" || phase === "done"
  );

  const [aiStart, setAiStart] = useState(false);
  useEffect(() => {
    if (userDone && phase === "user-typing") {
      const t = setTimeout(() => { setAiStart(true); setPhase("ai-typing"); }, PAUSE_AFTER_USER);
      return () => clearTimeout(t);
    }
  }, [userDone, phase]);

  const { displayed: aiText, done: aiDone } = useTypewriter(
    AI_MESSAGE, reduce ? 0 : CHAR_SPEED, aiStart
  );

  useEffect(() => {
    if (aiDone && phase === "ai-typing") {
      const t = setTimeout(() => setPhase("code-streaming"), PAUSE_AFTER_AI);
      return () => clearTimeout(t);
    }
  }, [aiDone, phase]);

  useEffect(() => {
    if (phase !== "code-streaming") return;
    if (visibleCodeLines >= CODE_LINES.length) { setPhase("done"); return; }
    const t = setTimeout(() => setVisibleCodeLines(v => v + 1), reduce ? 0 : LINE_DELAY);
    return () => clearTimeout(t);
  }, [phase, visibleCodeLines, reduce]);

  /* Tab order: Code first, Preview second */
  const tabs = [
    { id: "code" as const, label: "Code", icon: Code2 },
    { id: "preview" as const, label: "Preview", icon: Eye },
  ];

  return (
    <motion.div
      ref={containerRef}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE_OUT }}
      className="relative mx-auto mt-16 w-full max-w-6xl"
    >
      {/* Glow */}
      <div className="absolute -top-10 left-1/2 -z-10 h-[400px] w-[80%] -translate-x-1/2 rounded-full bg-zinc-700/20 opacity-50 blur-[120px]" />

      {/* Main App Window */}
      <div className="relative flex h-[520px] w-full overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950 shadow-2xl md:h-[600px]">

        {/* ── Left Sidebar: Chat ────────────────────────────── */}
        <div className="hidden w-80 flex-col border-r border-zinc-800 bg-zinc-900/40 md:flex">
          <div className="flex items-center gap-2 border-b border-zinc-800/80 p-4">
            <Bot className="size-5 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-300">c0 Assistant</span>
          </div>

          <div className="flex-1 space-y-4 overflow-hidden p-4">
            {/* User message */}
            {phase !== "idle" && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                className="flex gap-3"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-800">
                  <User className="size-4 text-zinc-400" />
                </div>
                <div className="flex-1 rounded-2xl rounded-tl-sm bg-zinc-800/50 p-3 text-sm text-zinc-300">
                  {userText}
                  {phase === "user-typing" && !userDone && (
                    <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-zinc-400" />
                  )}
                </div>
              </motion.div>
            )}

            {/* AI message */}
            {aiStart && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                className="flex gap-3"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-zinc-950">
                  <Bot className="size-4" />
                </div>
                <div className="flex-1 rounded-2xl rounded-tl-sm bg-zinc-800 p-3 text-sm text-zinc-300">
                  {aiText}
                  {phase === "ai-typing" && !aiDone && (
                    <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-zinc-400" />
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Input with blinking cursor */}
          <div className="border-t border-zinc-800/80 p-4">
            <div className="flex items-center rounded-xl border border-zinc-700/50 bg-zinc-800/30 px-3 py-2 text-sm text-zinc-500">
              <span>Type a message...</span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                className="ml-0.5 inline-block h-4 w-[2px] bg-zinc-500"
              />
            </div>
          </div>
        </div>

        {/* ── Right Area: VS Code style ─────────────────────── */}
        <div className="flex flex-1 flex-col overflow-hidden bg-zinc-950">

          {/* VS Code Title Bar */}
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/60 px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="size-3 rounded-full bg-red-500/70" />
                <div className="size-3 rounded-full bg-yellow-500/70" />
                <div className="size-3 rounded-full bg-green-500/70" />
              </div>
              <span className="ml-3 text-xs text-zinc-500">auth-page.tsx</span>
            </div>
            <span className="text-[10px] text-zinc-600">c0 Editor</span>
          </div>

          {/* Clickable Tabs: Code first, Preview second */}
          <div className="flex items-center border-b border-zinc-800 bg-zinc-900/20 px-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors duration-150",
                    isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  <Icon className="size-3.5" />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute inset-x-0 -bottom-px h-0.5 bg-white"
                      transition={{ duration: 0.2, ease: EASE_OUT }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === "code" ? (
                <motion.div
                  key="code"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0 overflow-hidden p-4 font-mono text-[13px] leading-6 text-zinc-400 sm:p-5"
                >
                  <div className="flex gap-4">
                    <div className="hidden w-8 select-none flex-col text-right text-zinc-700 sm:flex">
                      {CODE_LINES.slice(0, Math.max(visibleCodeLines, 1)).map((_, i) => (
                        <span key={i} className="leading-6">{i + 1}</span>
                      ))}
                    </div>
                    <div className="min-w-0 flex-1">
                      {CODE_LINES.slice(0, visibleCodeLines).map((line, i) => (
                        <motion.div
                          key={i}
                          initial={reduce ? false : { opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, ease: EASE_OUT }}
                          style={{ paddingLeft: `${line.indent * 20}px` }}
                          className={cn("whitespace-nowrap leading-6", line.tokens.length === 0 && "h-6")}
                        >
                          {line.tokens.map((token, j) => (
                            <span key={j} className={token.color}>{token.text}</span>
                          ))}
                        </motion.div>
                      ))}
                      {phase === "code-streaming" && (
                        <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-zinc-500" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0 overflow-auto"
                >
                  <PreviewPane />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent" />
      </div>
    </motion.div>
  );
}
