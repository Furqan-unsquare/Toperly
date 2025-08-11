import React, { useState, useEffect, useRef } from 'react';

const SubscriptionPlans = () => {
  const [activeTab, setActiveTab] = useState('Personal Plan');
  const [allExpanded, setAllExpanded] = useState(false);
  const [isCompareVisible, setIsCompareVisible] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const compareRef = useRef(null);

  // Intersection Observer for sticky header
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCompareVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (compareRef.current) {
      observer.observe(compareRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const plans = [
    {
      title: 'Personal Plan',
      subtitle: 'For you',
      description: 'Individual',
      price: '₹500/month',
      originalPrice: null,
      note: 'Billed monthly or ₹5000 annually',
      buttonText: 'Start subscription',
      features: [
        'Access to 10,000+ top courses',
        'Certification prep',
        'Goal-focused recommendations',
        'AI-powered coding exercises'
      ]
    },
    {
      title: 'Team Plan',
      subtitle: '2 to 20 people',
      description: null,
      price: '₹2,000 a month per user',
      originalPrice: null,
      note: 'Billed monthly',
      buttonText: 'Start subscription',
      features: [
        'Access to 15,000+ top courses',
        'Certification prep',
        'Goal-focused recommendations',
        'AI-powered coding exercises',
        'Analytics and adoption reports'
      ]
    },
    {
      title: 'Enterprise Plan',
      subtitle: 'More than 20 people',
      description: 'For your organization',
      price: 'Contact sales for pricing',
      originalPrice: null,
      note: null,
      buttonText: 'Request a demo',
      features: [
        'Access to 20,000+ top courses',
        'Certification prep',
        'Goal-focused recommendations',
        'Analytics and adoption reports',
        'Advanced analytics and insights',
        'Dedicated customer success team',
        'International course collection featuring 15 languages',
        'Customizable content',
        'Hands-on tech training with add-on',
        'Strategic implementation services with add-on'
      ]
    }
  ];

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
    },
    {
      text: "I am a software developer and I need a significant part of my success to the solid foundation laid by this course.",
      author: "Rohit K.",
      title: "View this Java course",
      avatar: "R"
    },
    {
      text: "I would highly recommend this Web Development Bootcamp to anyone interested in pursuing a career in web development. The instructor was great.",
      author: "Yuva A",
      title: "View this Web Development course",
      avatar: "Y"
    }
  ];

  const comparisonFeatures = [
    { category: 'Learner experience', features: [
      { name: 'Top-rated courses', personal: '20,000+', team: '20,000+', enterprise: '20,000+ (including international collection)' },
      { name: 'Certification prep courses and practice tests', personal: true, team: true, enterprise: true },
      { name: 'AI-powered coding exercises', personal: true, team: true, enterprise: true },
      { name: 'Goal-aligned recommendations', personal: true, team: true, enterprise: true },
      { name: 'Instructor Q&A', personal: true, team: true, enterprise: true },
      { name: 'Mobile app access', personal: true, team: true, enterprise: true }
    ]},
    { category: 'Admin experience', features: [
      { name: 'User adoption and engagement reports', personal: false, team: true, enterprise: true },
      { name: '24/7 customer support', personal: false, team: true, enterprise: true },
      { name: 'Custom learning paths, channels, and user groups', personal: false, team: false, enterprise: true },
      { name: 'User activity, learning trends, and benchmark insights', personal: false, team: false, enterprise: true },
      { name: 'Integration capabilities', personal: false, team: false, enterprise: true }
    ]},
    { category: 'Udemy Pro add-on for tech learners', features: [
      { name: 'Hands-on assessments', personal: 'add-on', team: 'add-on', enterprise: 'included' },
      { name: 'Labs and technical workspaces', personal: 'add-on', team: 'add-on', enterprise: 'included' },
      { name: 'Pre-built paths', personal: 'add-on', team: 'add-on', enterprise: 'included' },
      { name: 'Advanced insights', personal: 'add-on', team: 'add-on', enterprise: 'included' }
    ]}
  ];

  const faqs = [
    { question: 'How are courses selected for the plans?', answer: 'Our courses are carefully curated by experts to ensure the highest quality content for learners at all levels.' },
    { question: 'How is Personal Plan different from buying a course?', answer: 'Personal Plan gives you access to our entire library of courses with a single subscription, plus additional features like AI-powered recommendations.' },
    { question: 'What languages does Enterprise Plan have content for?', answer: 'Enterprise Plan includes content in 15 different languages to support global teams and organizations.' },
    { question: 'What is Udemy Business Pro?', answer: 'Udemy Business Pro is our premium add-on that includes hands-on assessments, labs, technical workspaces, and advanced insights for technical teams.' }
  ];

  const handleStartLearning = (planType) => {
    window.location.href = '/subscriptions';
  };

  const toggleFeatures = () => {
    setAllExpanded(!allExpanded);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-200 to-purple-50">
      {/* Sticky Header - shows when compare table is visible */}
      <div className={`fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg z-50 transition-all duration-300 ${isCompareVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <div key={index} className="text-center">
                <h3 className="font-semibold text-lg text-gray-900">{plan.title}</h3>
                <p className="text-purple-600 font-medium">{plan.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-6xl mx-auto pt-36 pb-12 px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose a plan for success
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Don't want to buy courses one by one? Pick a plan to help you, your team, or your organization achieve outcomes faster.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              {/* Plan Header */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{plan.title}</h3>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      {plan.subtitle}
                    </div>
                  </div>
                </div>
                {plan.description && (
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                )}
                
                <div className="mb-4">
                  <div className="text-2xl font-bold text-gray-900">{plan.price}</div>
                  {plan.note && (
                    <div className="text-sm text-gray-500">{plan.note}</div>
                  )}
                </div>

                <button
                  onClick={() => handleStartLearning(plan.title)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {plan.buttonText}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Features */}
              <div className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Section */}
        <div className="text-center mb-16">
          <p className="text-gray-600 mb-8">Trusted by over 16,000 companies and millions of learners around the world</p>
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
            See what others are achieving through learning
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="text-4xl text-purple-600 mb-4">"</div>
                <p className="text-gray-700 text-sm mb-4 line-clamp-4">{testimonial.text}</p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-900">{testimonial.author}</div>
                    <div className="text-purple-600 text-xs hover:underline cursor-pointer">{testimonial.title} →</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div ref={compareRef} className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Compare plans and features
          </h2>
          
          {/* Table Header */}
          <div className="bg-white rounded-t-xl border border-gray-200">
            <div className="grid grid-cols-4 gap-6 p-6 border-b border-gray-200">
              <div></div>
              {plans.map((plan, index) => (
                <div key={index} className="text-center">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{plan.title}</h3>
                  <p className="text-purple-600 font-medium mb-2">{plan.price}</p>
                  <div className="text-sm text-gray-600 mb-4">
                    <div className="flex items-center justify-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      {plan.subtitle}
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartLearning(plan.title)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                  >
                    {plan.buttonText}
                  </button>
                </div>
              ))}
            </div>

            {/* Comparison Features */}
            {comparisonFeatures.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-900">{category.category}</h4>
                </div>
                {category.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="grid grid-cols-4 gap-6 p-6 border-b border-gray-200 last:border-b-0">
                    <div className="flex items-center">
                      <span className="text-gray-700">{feature.name}</span>
                    </div>
                    <div className="text-center">
                      {typeof feature.personal === 'boolean' ? (
                        feature.personal ? (
                          <svg className="w-6 h-6 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : null
                      ) : (
                        <span className="text-gray-900 font-medium">{feature.personal}</span>
                      )}
                    </div>
                    <div className="text-center">
                      {typeof feature.team === 'boolean' ? (
                        feature.team ? (
                          <svg className="w-6 h-6 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : null
                      ) : (
                        <span className="text-gray-900 font-medium">{feature.team}</span>
                      )}
                    </div>
                    <div className="text-center">
                      {typeof feature.enterprise === 'boolean' ? (
                        feature.enterprise ? (
                          <svg className="w-6 h-6 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : null
                      ) : (
                        <span className="text-gray-900 font-medium">{feature.enterprise}</span>
                      )}
                    </div>
                  </div>
                ))}
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
              <div key={index} className="bg-white rounded-lg border border-gray-200">
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
                {openFaqIndex === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;