import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-white/6 mt-8">
      <div className="container py-6 text-sm text-slate-400 text-center">
        © {new Date().getFullYear()} Energy Teen. Built from a Figma prototype.
      </div>
    </footer>
  )
}
