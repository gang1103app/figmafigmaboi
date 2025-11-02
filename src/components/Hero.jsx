import React from 'react'

export default function Hero() {
  return (
    <section className="py-10">
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="">
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">
            Save energy. Save the planet. Make it fun.
          </h1>
          <p className="mt-4 text-slate-300 max-w-xl">
            Track your energy habits, join challenges, earn rewards, and compete with friends — designed for teens.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a href="#signup" className="inline-block bg-brand-primary text-[#022] px-4 py-2 rounded-lg font-semibold shadow-md">Sign up — it's free</a>
            <a href="#demo" className="inline-block border border-white/6 px-4 py-2 rounded-lg text-slate-300">View demo</a>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div
            className="w-[300px] sm:w-[360px] h-[600px] rounded-3xl bg-gradient-to-b from-[#081324] to-[#0c1624] border border-white/6 shadow-lg flex items-center justify-center text-slate-400"
            aria-hidden="true"
          >
            <img
              src="https://via.placeholder.com/300x600?text=App+Preview"
              alt="App preview placeholder"
              className="rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}