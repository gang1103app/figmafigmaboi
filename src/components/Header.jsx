import React from 'react'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-black/40 border-b border-white/6">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-md bg-gradient-to-br from-green-400 to-teal-300 flex items-center justify-center text-[#022] font-bold">ET</div>
          <span className="font-semibold">EnergyTeen</span>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-slate-300">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#how" className="hover:text-white">How it works</a>
          <a href="#signup" className="px-3 py-1 rounded-lg border border-white/6 text-sm">Get started</a>
        </nav>

        <div className="md:hidden">
          <button aria-label="Open menu" className="p-2 rounded-md border border-white/6">
            ☰
          </button>
        </div>
      </div>
    </header>
  )
}