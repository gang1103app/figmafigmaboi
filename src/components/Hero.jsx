import React from 'react'

function Hero() {
  return (
    <section id="home" className="bg-gradient-to-b from-white to-gray-50 py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Save Energy,
            <span className="text-primary block mt-2">Save the Planet</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of teens making a difference. Track your energy savings, 
            compete with friends, and earn rewards while protecting our environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="#signup" className="btn-primary w-full sm:w-auto">
              Start Saving Now
            </a>
            <button className="btn-outline w-full sm:w-auto">
              Learn More
            </button>
          </div>
        </div>

        {/* Hero Image/Illustration Placeholder */}
        <div className="mt-12 sm:mt-16">
          <div className="relative mx-auto max-w-4xl">
            <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-2xl p-8 sm:p-12 md:p-16 aspect-video flex items-center justify-center">
              <div className="text-center text-white">
                <svg
                  className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <p className="text-xl sm:text-2xl font-semibold">Energy Tracking Made Fun</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">50k+</div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">1M+</div>
            <div className="text-gray-600">kWh Saved</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">$100k+</div>
            <div className="text-gray-600">Money Saved</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
