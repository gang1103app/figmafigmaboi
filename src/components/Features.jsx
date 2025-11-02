import React from 'react';

const Features = () => {
  const features = [
    {
      icon: '📊',
      title: 'Real-Time Tracking',
      description: 'Monitor your energy consumption in real-time with intuitive dashboards and easy-to-understand metrics.',
    },
    {
      icon: '💰',
      title: 'Save Money',
      description: 'Get personalized tips to reduce your energy bills. See exactly how much you\'re saving each month.',
    },
    {
      icon: '🌱',
      title: 'Help the Planet',
      description: 'Track your carbon footprint reduction and contribute to a greener future for everyone.',
    },
    {
      icon: '🎯',
      title: 'Set Goals',
      description: 'Create custom energy-saving goals and track your progress with motivating milestones.',
    },
    {
      icon: '🏆',
      title: 'Compete & Win',
      description: 'Challenge your friends, climb leaderboards, and earn badges for your achievements.',
    },
    {
      icon: '📱',
      title: 'Mobile First',
      description: 'Access all features on the go with our mobile-optimized platform. Available anywhere, anytime.',
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features for Teens
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to start saving energy and money, all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 md:p-8 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-12 md:mt-16">
          <a href="#signup" className="btn-primary inline-block">
            Get Started Today
          </a>
        </div>
      </div>
    </section>
  );
};

export default Features;
