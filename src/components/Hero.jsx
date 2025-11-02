export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-green-50 to-white py-12 md:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Save Energy,
              <span className="text-primary block mt-2">Save the Planet</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Join thousands of teens making a difference! Track your energy usage, 
              learn sustainable habits, and compete with friends to reduce your carbon footprint.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#signup" className="btn-primary text-center">
                Start Saving Energy
              </a>
              <a href="#features" className="btn-secondary text-center">
                Learn More
              </a>
            </div>
            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-gray-600">kWh Saved</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-primary">30%</div>
                <div className="text-sm text-gray-600">Avg. Reduction</div>
              </div>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="flex-1 w-full max-w-lg">
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl flex items-center justify-center p-8">
                {/* Placeholder illustration - can be replaced with actual image */}
                <div className="text-center">
                  <div className="w-32 h-32 md:w-48 md:h-48 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-16 h-16 md:w-24 md:h-24 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Energy Tracking Made Simple</p>
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-xl">🌱</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
