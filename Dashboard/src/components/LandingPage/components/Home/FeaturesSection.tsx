
import React, { useState, useEffect } from 'react';
import { X, Minimize2, Square, Users, TrendingUp, Settings, Bell, ChevronRight } from 'lucide-react';

const VirtualDeviceBrowser = () => {
  const [activeTab, setActiveTab] = useState('openwork');
  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const tabs = [
    { id: 'openwork', name: 'Assessments', color: 'bg-blue-500', icon: '📚' },
    { id: 'interactions', name: 'Certified Courses', color: 'bg-purple-500', icon: '🏅' },
    { id: 'analytics', name: 'Hyper-Focused on AI', color: 'bg-green-500', icon: '🧠' },
    { id: 'resources', name: 'Career-Ready Skills', color: 'bg-orange-500', icon: '🚀' },
  ];

  const tabContent = {
    openwork: {
      title: 'Assessments Dashboard',
      img: 'https://i.pinimg.com/736x/f8/71/d0/f871d07ba296050b21bb1355c4582597.jpg',
      desc: 'Learning is most effective when tested immediately. Our courses integrate on-the-spot assessments after every lesson, ensuring students reinforce what they learn in real time. These include quizzes, coding challenges, and scenario-based questions crafted to enhance memory retention.',
    },
    interactions: {
      title: 'Certified Courses',
      img: 'https://i.pinimg.com/736x/81/a2/98/81a2988606015871143db36f9872f905.jpg',
      desc: 'Knowledge is powerful—but proof of knowledge is priceless. Upon successful completion of our courses, learners receive industry-verified certificates that showcase their skills and dedication.',
    },
    analytics: {
      title: 'AI-Powered Insights',
      img: 'https://i.pinimg.com/736x/b7/ee/06/b7ee068397409d41f97779f3d75581f0.jpg',
      desc: 'We don’t just teach AI—we live and breathe it. Our curriculum is hyper-focused on Artificial Intelligence and related technologies, offering deep dives into machine learning, NLP, computer vision, and generative AI.Rather than spreading thin across tech topics, we double down on AI to make sure learners become specialists.',
    },
    resources: {
      title: 'Career-Ready Skills',
      img: 'https://i.pinimg.com/1200x/2d/f3/f6/2df3f6e14b0c1e8dc690627a44c68a0c.jpg',
      desc: 'Technical knowledge alone doesn’t land jobs—career-ready skills do. Our programs go beyond code, incorporating real-world problem-solving, communication, and collaborative projects that reflect workplace scenarios.',
    },
  };

  const handleTabChange = (tabId) => {
    setIsLoading(true);
    setAnimationKey((prev) => prev + 1);
    setTimeout(() => {
      setActiveTab(tabId);
      setIsLoading(false);
    }, 300);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-400';
      case 'pending':
        return 'bg-yellow-400';
      case 'completed':
        return 'bg-blue-400';
      case 'new':
        return 'bg-purple-400';
      default:
        return 'bg-gray-400';
    }
  };

  const currentContent = tabContent[activeTab];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4 relative overflow-hidden">
      {/* AI Particle Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover what makes our  {""}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent block md:inline">
              platform exceptional
            </span>
          </h1>
          <p className="text-gray-600 max-w-2xl text-sm md:text-md mx-auto">
            Explore AI-driven assessments, certified courses, and career-ready skills in a seamless virtual environment powered by cutting-edge technology.
          </p>
        </div>

        {/* Browser Container */}
        <div className="max-w-6xl mx-auto">
          {/* Browser Header */}
          <div className="bg-gray-100 rounded-t-2xl px-4 py-3 flex items-center justify-between border-b border-gray-200/50 backdrop-blur-md">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <div className="flex-1 max-w-md mx-4">
              <div className="bg-white/80 backdrop-blur-md rounded-lg px-3 py-1.5 text-sm text-gray-600 border border-gray-200/50">
                https://toperly.ai
              </div>
            </div>
            <div className="flex items-center space-x-2 opacity-50">
              <Minimize2 size={14} />
              <Square size={14} />
              <X size={14} />
            </div>
          </div>

          {/* Main Interface */}
          <div className="bg-white rounded-b-2xl shadow-xl overflow-hidden">
            <div className="flex flex-col lg:flex-row min-h-[600px]">
              {/* Sidebar */}
              <div className="w-full lg:w-80 bg-gradient-to-b from-gray-50 to-white border-r border-gray-100 pt-6 px-2 md:p-6">
                {/* Tab Navigation */}
              <div className="mb-8">
  {/* Mobile layout: horizontal scroll */}
<div className="flex gap-1 overflow-x-auto scrollbar-hide lg:hidden">
  {tabs.slice(0, 3).map((tab) => (
    <button
      key={tab.id}
      onClick={() => handleTabChange(tab.id)}
      className={`
        flex items-center justify-center rounded-t-xl transition-all duration-300 whitespace-nowrap
        ${activeTab === tab.id
          ? 'bg-white mx-1 transform border border-gray-100 px-4 py-2 space-x-2'
          : 'bg-gray-100 hover:bg-white/100 -sm px-3 py-2 w-12'
        }
      `}
      aria-label={tab.name}
      title={tab.name}
    >
      <span className="text-base">{tab.icon}</span>
      {activeTab === tab.id && (
        <span className="font-medium text-gray-900">{tab.name}</span>
      )}
      {activeTab === tab.id && (
        <div className={`w-2 h-2 ${tab.color} rounded-full ml-auto animate-pulse`}></div>
      )}
    </button>
  ))}
</div>


  {/* Desktop layout: vertical stack */}
  <div className="hidden lg:flex lg:flex-col gap-2">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => handleTabChange(tab.id)}
        className={`
          flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 text-left w-full
          ${activeTab === tab.id
            ? 'bg-white shadow-lg transform  border-gray-100'
            : 'hover:bg-white/50 hover:shadow-md'
          }
        `}
      >
        <span className="text-lg">{tab.icon}</span>
        <span className={`font-medium ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-600'}`}>
          {tab.name}
        </span>
        {activeTab === tab.id && (
          <div className={`w-2 h-2 ${tab.color} rounded-full ml-auto animate-pulse`}></div>
        )}
      </button>
    ))}
  </div>
</div>


            <div>
              <img src="https://i.pinimg.com/1200x/e0/df/82/e0df82d1d992ef040ad6052e3c569ec8.jpg" alt="" 
              className='rounded-xl hidden lg:block'/>
            </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 px-6  md:pb-4 lg:p-8">
                {/* Content Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {currentContent.title}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Last updated: 2 minutes ago</span>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center space-x-2 mt-4 sm:mt-0">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 group">
                      <Bell size={18} className="text-gray-600 group-hover:text-purple-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 group">
                      <Settings size={18} className="text-gray-600 group-hover:text-purple-600" />
                    </button>
                  </div>
                </div>

                {/* Content Display */}
                <div
                  key={animationKey}
                  className={`transition-all  duration-500 ${
                    isLoading ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
                  }`}
                >
                  <div className="bg-white/80 backdrop-blur-md border border-gray-100/50 md:p-6 ">
                    <img
                      src={currentContent.img}
                      alt={currentContent.title}
                      className="w-full h-64 object-cover rounded-lg mb-4 transform  transition-all duration-300"
                    />
                    <p className="line-clamp-4 text-gray-600 text-sm md:text-base leading-relaxed">
                      {currentContent.desc}
                    </p>
                  </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }

        @keyframes zoom-in {
          0% { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes slide-up-delayed {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fade-in-up {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes scale-in {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes float-network {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes pulse-line {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        
        @keyframes data-flow {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(100px) rotate(0deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(100px) rotate(-360deg); opacity: 0; }
        }
        
        @keyframes progress-fill {
          0% { width: 0%; }
          100% { width: var(--final-width, 100%); }
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-zoom-in { animation: zoom-in 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .animate-slide-up-delayed { animation: slide-up-delayed 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .animate-scale-in { animation: scale-in 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .animate-float-network { animation: float-network linear infinite; }
        .animate-pulse-line { animation: pulse-line 2s ease-in-out infinite; }
        .animate-data-flow { animation: data-flow 4s linear infinite; }
        .animate-progress-fill { animation: progress-fill 2s ease-out forwards; }
        .animate-gradient-shift { animation: gradient-shift 3s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default VirtualDeviceBrowser;
