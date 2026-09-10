"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const TECH_STACK = [
  {
    name: "Next.js",
    description: "The React framework for production",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6 text-zinc-400">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 16l8-8" />
        <path d="M16 16V8" />
      </svg>
    ),
  },
  {
    name: "React",
    description: "Component-based UI library",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6 text-zinc-400">
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(150 12 12)" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "TypeScript",
    description: "Type-safe JavaScript at scale",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6 text-zinc-400">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 10h6" />
        <path d="M12 10v6" />
      </svg>
    ),
  },
  {
    name: "Tailwind CSS",
    description: "Utility-first CSS framework",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6 text-zinc-400">
        <path d="M12 4C8 4 6 7 6 11c1.5-1.5 3.5-2 5-1 1 .6 1.5 1.7 2 3.2C14 16 16 19 20 19c4 0 6-3 6-7-1.5 1.5-3.5 2-5 1-1-.6-1.5-1.7-2-3.2C18 7 16 4 12 4z" />
        <path d="M4 11C0 11 -2 14 -2 18c1.5-1.5 3.5-2 5-1 1 .6 1.5 1.7 2 3.2C6 23 8 26 12 26c4 0 6-3 6-7-1.5 1.5-3.5 2-5 1-1-.6-1.5-1.7-2-3.2C10 14 8 11 4 11z" />
      </svg>
    ),
  },
  {
    name: "shadcn/ui",
    description: "Beautiful, accessible components",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6 text-zinc-400">
        <path d="M4 4h16v16H4z" />
        <path d="M4 12h16" />
      </svg>
    ),
  },
  {
    name: "Prisma",
    description: "Next-generation database toolkit",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6 text-zinc-400">
        <path d="M12 3l8 14H4z" />
      </svg>
    ),
  },
  {
    name: "E2B",
    description: "Secure cloud sandboxes for AI",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6 text-zinc-400">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 12h8" />
      </svg>
    ),
  },
]

export function StackCarousel() {
  const shouldReduceMotion = useReducedMotion()
  const scrollRef = React.useRef<HTMLDivElement>(null)
  
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <section className="py-24 max-w-7xl mx-auto px-6 overflow-hidden">
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
      >
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-medium text-white">Built on a modern stack</h2>
          <p className="text-base md:text-lg text-zinc-400 max-w-[65ch]">
            chai0 generates production-ready Next.js apps using the tools you already know.
          </p>
        </div>
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="flex size-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.97] transition-all disabled:opacity-30"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex size-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.97] transition-all disabled:opacity-30"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </motion.div>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 -mx-6 px-6 md:mx-0 md:px-0 transition-transform duration-300 ease-out [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {TECH_STACK.map((tech, index) => (
          <motion.div
            key={tech.name}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.06, ease: [0.23, 1, 0.32, 1] }}
            className="snap-center shrink-0 min-w-[240px] md:min-w-[300px] bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5"
          >
            <div className="size-10 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4">
              {tech.icon}
            </div>
            <h3 className="text-lg font-medium text-white mb-1">{tech.name}</h3>
            <p className="text-sm text-zinc-400">{tech.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
