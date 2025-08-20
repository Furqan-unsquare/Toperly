import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';

const PricingTable = () => {
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const plans = [
    {
      id: 'Starter Plan',
      name: 'Starter Plan',
      subtitle: 'Students who are just starting in AI/ML.',
      price: '₹2,999',
      currency: 'INR',
      period: '/month',
      billingInfo: 'billed yearly ₹35,988',
      promo: '₹20/month for first 3 months',
      promoColor: 'bg-green-400',
      textColor: 'text-black',
      buttonText: 'Try for free',
      buttonStyle: 'bg-black text-white',
      features: [
        'Standard Courses (AI/ML/Python)',
        '1 Premium course',
        'Multilingual Subtitles',
        'AI Mentor Chat',
        'Group Doubt-Solving Sessions',
        '1 Course Certificate',
      ]
    },
    {
      id: 'Prime Plan',
      name: 'Prime Plan',
      subtitle: 'Students who are serious about career-building in AI/ML.',
      price: '₹4,999',
      currency: 'INR',
      period: '/month',
      billingInfo: 'billed yearly ₹59,988',
      promo: '₹20/month for first 3 months',
      promoColor: 'bg-green-400',
      textColor: 'text-black',
      buttonText: 'Try for free',
      buttonStyle: 'bg-black text-white',
      features: [
        'All Premium course',
        'Celebrity/IIT Masterclass',
        '1:1 Mentor Support',
        'Resume Reviews & Career Roadmap Support',
        'Hackathons & Placement Access',
        '3 Course Certificates',
        'Live Events/AMA with Celebrity Mentors',
      ]
    },
    {
      id: 'Annual Plan',
      name: 'Annual Plan',
      subtitle: 'Students who want to master AI/ML completely and commit long-term.',
      price: '₹44,999',
      currency: 'INR',
      period: '/year',
      billingInfo: 'billed monthly ₹3,750',
      promo: 'Available on a 1- or 3-year term',
      promoColor: 'bg-[#255DEE]',
      textColor: 'text-gray-200',
      buttonText: 'Get started',
      buttonStyle: 'bg-black text-white',
      features: [
        'Multilingual Learning – Learn in your language',
        '24/7 AI Mentor Chat – Instant academic help',
        'Weekly Group Sessions for real-time doubts',
        'Dedicated 1:1 Mentorship for every learner',
        'Priority Entry to Hackathons & Job Drives',
        'Earn up to 36 Recognized Course Certificates',
        'Attend Live AMAs with Industry Icons',
      ]
    }
  ];

  const handleExpand = (planId) => {
    if (window.innerWidth < 768) {
      // Mobile: only one plan expanded at a time
      setExpandedPlan(expandedPlan === planId ? null : planId);
    } else {
      // Desktop: expand all features
      setShowAllFeatures(!showAllFeatures);
    }
  };

  const getVisibleFeatures = (features, planId) => {
    if (window.innerWidth < 768) {
      // Mobile: show based on individual plan expansion
      return expandedPlan === planId ? features : features.slice(0, 4);
    } else {
      // Desktop: show based on global expand state
      return showAllFeatures ? features : features.slice(0, 5);
    }
  };

  const shouldShowExpandButton = (features, planId) => {
    if (window.innerWidth < 768) {
      return features.length > 4;
    } else {
      return features.length > 4;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center p-6">
  <h1 className="text-3xl font-bold mb-2">Subscription Plan</h1>
  <p className="text-xs md:text-base text-gray-600 max-w-xl mx-auto">
   Upgrade anytime to unlock advanced courses, gain access to exclusive features, and extend your learning limits.
  </p>
</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-2xl shadow-lg border">
            {/* Promo Banner */}
            <div className={`${plan.promoColor} ${plan.textColor} text-sm font-medium px-3 py-2 rounded-t-2xl mb-4 text-center`}>
              {/* {plan.promo} */}
            </div>
            <div className='p-6'>
            {/* Plan Header */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              
              <div className="mb-2">
                <span className="text-4xl font-semibold text-gray-900">{plan.price}</span>
                <span className="text-sm text-gray-500 ml-1">{plan.currency}</span>
                <span className="text-lg text-gray-500">{plan.period}</span>
              </div>
              <p className="text-sm text-gray-500">{plan.billingInfo}</p>
            </div>

            {/* Action Buttons */}
            <div className="mb-6 space-y-3">
              <button className={`w-full py-3 px-4 rounded-full font-semibold ${plan.buttonStyle} hover:opacity-90 transition-opacity`}>
                {plan.buttonText}
              </button>
            </div>

            {/* Best For */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Best for</h4>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-600">{plan.subtitle}</span>
              </div>
            </div>

            {/* Standout Features */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Standout features</h4>
              <div className="space-y-2">
                {plan.id === 'Prime Plan' && (
                  <div className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600 font-semibold">Includes everything from Starter Plan</span>
                  </div>
                )}
                {plan.id === 'Annual Plan' && (
                  <div className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600 font-semibold">Includes everything from Prime Plan</span>
                  </div>
                )}
                {getVisibleFeatures(plan.features, plan.id).map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
              
              {shouldShowExpandButton(plan.features, plan.id) && (
                <button
                  onClick={() => handleExpand(plan.id)}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800 mt-3 font-medium"
                >
                  {(window.innerWidth < 768 ? expandedPlan === plan.id : showAllFeatures) ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" />
                      Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      Show more features
                    </>
                  )}
                </button>
              )}
            </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingTable;