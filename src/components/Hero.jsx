import React from 'react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-green-50 to-blue-50 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Text content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Save Energy, <span className="text-primary">Save Money</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
              Join thousands of teens learning to make a positive impact on the environment 
              while saving money. Track your energy usage, get personalized tips, and compete 
              with friends!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a href="#signup" className="btn-primary text-center">
                Start Saving Now
              </a>
              <a 
                href="#features" 
                className="bg-white text-primary font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 text-center"
              >
                Learn More
              </a>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-12 max-w-xl mx-auto md:mx-0">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">10k+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">$2M+</div>
                <div className="text-sm text-gray-600">Money Saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">50%</div>
                <div className="text-sm text-gray-600">Avg. Savings</div>
              </div>
            </div>
          </div>

          {/* Hero image/illustration */}
          <div className="flex-1 w-full max-w-lg">
            <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-2xl p-8 md:p-12 text-white">
              <div className="text-center">
                <div className="text-6xl mb-4">🌍</div>
                <h3 className="text-2xl font-bold mb-2">Make a Difference</h3>
                <p className="text-green-100">
                  Every small action counts. Start your energy-saving journey today!
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">💡</div>
                  <div className="text-sm">Track Usage</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🏆</div>
                  <div className="text-sm">Earn Rewards</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">📊</div>
                  <div className="text-sm">See Progress</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">👥</div>
                  <div className="text-sm">Join Community</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
