import Link from "next/link"
import { Chai0Logo } from "@/components/brand/chai0-logo"

export function LandingFooter() {
  return (
    <footer className="border-t border-zinc-800/50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 mb-16">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Chai0Logo />
            <p className="text-sm text-zinc-500">
              AI-powered web app generator
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-zinc-300">Product</h4>
            <ul className="space-y-3">
              <li><Link href="#features" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Features</Link></li>
              <li><Link href="#how-it-works" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">How it Works</Link></li>
              <li><Link href="#pricing" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-zinc-300">Resources</h4>
            <ul className="space-y-3">
              <li><Link href="/docs" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Documentation</Link></li>
              <li><Link href="https://github.com" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">GitHub</Link></li>
              <li><Link href="/changelog" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-zinc-300">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">About</Link></li>
              <li><Link href="/blog" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-zinc-300">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            © 2025 chai0. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
