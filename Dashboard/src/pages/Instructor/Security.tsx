import React, { useState } from 'react';
import { Search, Smartphone, Gift, Award } from 'lucide-react';

const TermsPrivacyPage = () => {
  const [activeTab, setActiveTab] = useState('General Policy');

  const tabs = ['General Policy', 'Booking Terms', 'Privacy Policy', 'Cancellations'];

  const keyFeatures = [
    {
      icon: <Search className="w-6 h-6 text-blue-600" />,
      title: "Easy Search & Booking",
      description: "Book flight, hotels and holiday packages worldwide"
    },
    {
      icon: <Smartphone className="w-6 h-6 text-blue-600" />,
      title: "Mobile Experience", 
      description: "Access our services through website or mobile app"
    },
    {
      icon: <Gift className="w-6 h-6 text-blue-600" />,
      title: "Special Offers",
      description: "Enjoy free trips, air ticker discounts and other rewards"
    },
    {
      icon: <Award className="w-6 h-6 text-blue-600" />,
      title: "Rewards Program",
      description: "Earn Coins through booking that can be used for discounts"
    }
  ];

  const tabContent = {
    'General Policy': {
      title: 'About Toperly',
      content: `At Toperly, we think travel should be exciting and affordable. That's why we team up with hundreds of airlines to bring you the best deals on both domestic and international flights. Let us help you make your dream trip a reality!`
    },
    'Booking Terms': {
      title: 'Booking Terms & Conditions',
      content: 'All bookings are subject to availability and confirmation. Prices may vary based on travel dates, destinations, and booking class. Special terms may apply for group bookings and promotional offers.'
    },
    'Privacy Policy': {
      title: 'Privacy Policy',
      content: 'We are committed to protecting your privacy and personal information. We collect and use your data only as necessary to provide our services and improve your travel experience. Your information is never shared with third parties without your consent.'
    },
    'Cancellations': {
      title: 'Cancellation Policy',
      content: 'Cancellation policies vary by airline and booking type. Most bookings can be cancelled within 24 hours for a full refund. After this period, cancellation fees may apply based on the fare rules and timing of cancellation.'
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Terms & Privacy Policy</h2>
        </div>

        {/* Subheader */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm">Flyktk.com Terms & Policy covers how we handle your data.</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-0 border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          {activeTab === 'General Policy' ? (
            <>
              {/* About Section */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {tabContent[activeTab].title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {tabContent[activeTab].content}
                </p>
              </div>

              {/* Key Features */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Key Features Toperly.com</h3>
                <div className="space-y-6">
                  {keyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{feature.title}</h4>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Section */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
                <p className="text-gray-600 text-sm">
                  Contact our customer service team at{' '}
                  <a href="mailto:support@flyktk.com" className="text-blue-600 hover:underline">
                    support@flyktk.com
                  </a>
                </p>
              </div>
            </>
          ) : (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {tabContent[activeTab].title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {tabContent[activeTab].content}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsPrivacyPage;