"use client"

import { motion, useReducedMotion } from "motion/react"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="border-t border-zinc-800/50">
      <div className="py-24 max-w-7xl mx-auto px-6">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-8 text-center md:text-left"
        >
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-medium text-white">Ready to build something?</h2>
            <p className="text-base md:text-lg text-zinc-400 max-w-[65ch] mx-auto md:mx-0">
              Go from idea to working app in minutes, not days.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-4 shrink-0">
            <button className="w-full md:w-auto px-6 py-3 rounded-full bg-white text-zinc-950 font-medium hover:bg-zinc-200 active:scale-[0.97] transition-all">
              Start Building
            </button>
            <button className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors active:scale-[0.97]">
              Talk to us
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
