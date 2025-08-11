import React, { useState, useEffect, useRef } from 'react';

const SubscriptionPlans = () => {
  const [activeTab, setActiveTab] = useState('Personal Plan');
  const [expandedPlans, setExpandedPlans] = useState({});
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const comparisonRef = useRef(null);


  const companies = [
    { name: 'Volkswagen', logo: 'VW' },
    { name: 'Samsung', logo: 'SAMSUNG' },
    { name: 'Cisco', logo: 'cisco' },
    { name: 'Vimeo', logo: 'vimeo' },
    { name: 'P&G', logo: 'P&G' },
    { name: 'Eventbrite', logo: 'eventbrite' },
    { name: 'Citi', logo: 'citi' },
    { name: 'Ericsson', logo: 'ERICSSON' }
  ];

  const testimonials = [
    {
      text: "Because of this course I was able to clear my Tata interviews. Thanks for making such wonderful content.",
      author: "Moumita",
      title: "Business Intelligence (BI)",
      avatar: "M"
    },
    {
      text: "I would hazard me so much in my career. I spend as a frontend engineer and eventually transitioned to full stack. This course also helped me to land my dream.",
      author: "Aditya G.",
      title: "View this full Spring course",
      avatar: "A"
    }
  ];

  const comparisonFeatures = [
    { name: 'Standard Courses (AI/ML/Python)', personal: true, team: true  },
    { name: 'Access to Premium Courses', personal: 'Limited', team: 'Full' },
    { name: 'Masterclasses', personal: false, team: true },
    { name: 'Multilingual Subtitles', personal: true, team: true },
    { name: 'AI Mentor Chat', personal: 'Complementary', team: "Priotiy"  },
    { name: 'Group Doubt-Solving Sessions', personal: 'Less Sessions', team: 'More Sessions' },
    { name: '1:1 Mentor Support', personal: false, team: true },
    { name: 'Resume & Career Support', personal: false, team: true },
    { name: 'Hackathon & Placement', personal: false, team: true },
    { name: 'Certificates per Month', personal: 1, team: 'Upto 3' },
    { name: 'Live Events', personal: false, team: true },
  ];

  const faqs = [
    { 
      question: 'How are courses selected for the plans?', 
      answer: 'Our courses are carefully curated by experts to ensure the highest quality content for learners at all levels. We partner with top instructors and industry leaders to bring you the most relevant and up-to-date material.' 
    },
    { 
      question: 'Can I switch plans later?', 
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Your billing will be prorated based on your usage when you make changes to your subscription.' 
    }
  ];

  const handleStartLearning = (planType) => {
    // In a real app, this would redirect to checkout
    console.log(`Starting subscription for ${planType}`);
  };

  const togglePlanExpansion = (planId) => {
    setExpandedPlans(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };

  const scrollToComparison = () => {
    comparisonRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-200 to-purple-50">
      {/* Main Header */}
      <div className="max-w-6xl mx-auto pt-40 pb-12 px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose the right plan for your needs
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Flexible learning solutions for individuals and teams. Start small and upgrade anytime.
          </p>
        </div>

         {/* Comparison Table */}
        <div ref={comparisonRef} className="mb-16">
          
          {/* Table Header */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-3 gap-6 p-6 border-b border-gray-200 bg-gray-50">
              <div className="font-semibold text-gray-700">Features</div>
              <div className="text-center">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">Personal Plan</h3>
                <p className="text-purple-600 font-medium">₹500/month</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">Team Plan</h3>
                <p className="text-purple-600 font-medium">₹2,000/month per user</p>
              </div>
            </div>

            {/* Comparison Features */}
            {comparisonFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="grid grid-cols-3 gap-6 p-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-gray-700">{feature.name}</span>
                </div>
                <div className="text-center">
                  {feature.personal === true ? (
                    <svg className="w-6 h-6 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : feature.personal === false ? (
                    <svg className="w-6 h-6 text-red-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L10.586 10l-3.293 3.293a1 1 0 101.414 1.414L12 11.414l3.293 3.293a1 1 0 001.414-1.414L13.414 10l3.293-3.293a1 1 0 00-1.414-1.414L12 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-gray-700 font-medium">{feature.personal}</span>
                  )}
                </div>
                <div className="text-center">
                  {feature.team === true ? (
                    <svg className="w-6 h-6 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : feature.team === false ? (
                    <svg className="w-6 h-6 text-red-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L10.586 10l-3.293 3.293a1 1 0 101.414 1.414L12 11.414l3.293 3.293a1 1 0 001.414-1.414L13.414 10l3.293-3.293a1 1 0 00-1.414-1.414L12 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-gray-700 font-medium">{feature.team}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Section */}
        <div className="text-center mb-16">
          <p className="text-gray-600 mb-8">Trusted by leading companies worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {companies.map((company, index) => (
              <div key={index} className="text-gray-500 font-semibold text-lg">
                {company.logo}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Success stories from our learners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-4xl text-purple-600 mb-4">"</div>
                <p className="text-gray-700 text-sm mb-4 line-clamp-4">{testimonial.text}</p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-900">{testimonial.author}</div>
                    <div className="text-purple-600 text-xs hover:underline cursor-pointer">{testimonial.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

       

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200"
              >
                <button
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <svg
                    className={`w-6 h-6 text-gray-500 transform transition-transform ${
                      openFaqIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ${
                    openFaqIndex === index ? 'max-h-96 pb-6' : 'max-h-0'
                  }`}
                >
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;