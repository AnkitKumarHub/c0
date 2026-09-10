"use client"

import { motion, useReducedMotion } from "motion/react"
import { Check } from "lucide-react"

export function PricingTeaser() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="pricing" className="py-24 max-w-7xl mx-auto px-6">
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className="text-center space-y-4 mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-medium text-white">Simple, transparent pricing</h2>
        <p className="text-base md:text-lg text-zinc-400 max-w-[65ch] mx-auto">
          Start building for free. Upgrade when you need more.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-8 flex flex-col"
        >
          <div className="mb-6">
            <h3 className="text-xl font-medium text-white mb-2">Free</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-medium text-white">$0</span>
              <span className="text-zinc-400 text-sm">/month</span>
            </div>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            {["5 projects per month", "Community support", "Standard sandbox runtime", "Public projects"].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-zinc-300">
                <Check className="size-5 text-white shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <button className="w-full py-3 rounded-full bg-white text-zinc-950 font-medium hover:bg-zinc-200 active:scale-[0.97] transition-all">
            Get Started
          </button>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="bg-zinc-900/50 border border-zinc-700 rounded-2xl p-8 flex flex-col relative overflow-hidden"
        >
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-medium text-white">Pro</h3>
              <span className="text-xs bg-blue-500/10 text-blue-400 rounded-full px-2 py-0.5 border border-blue-500/20">
                Coming Soon
              </span>
            </div>
            <div className="flex items-baseline gap-1 h-[40px]">
              <span className="text-zinc-500 text-sm flex items-end pb-1">Pricing coming soon</span>
            </div>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            {["Unlimited projects", "Priority support", "Extended sandbox runtime", "Private projects", "Custom templates", "Team collaboration"].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-zinc-300">
                <Check className="size-5 text-zinc-500 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <button className="w-full py-3 rounded-full border border-zinc-700 text-white font-medium hover:bg-zinc-800 active:scale-[0.97] transition-all">
            Join Waitlist
          </button>
        </motion.div>
      </div>
      
      <p className="text-center text-sm text-zinc-500 mt-8">
        Pricing details coming soon
      </p>
    </section>
  )
}
