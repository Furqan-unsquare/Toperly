import React, { useState, useEffect } from 'react';
import { X, Plus, Search, Menu, Languages, Power, Group, Dock } from 'lucide-react';

const VirtualDevicesDashboard = () => {
  const [activeTab, setActiveTab] = useState('Languages');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Content data for different tabs
  const contentData = {
    Languages: {
      title: "Why Is Toperly Different",
      centralImage: "https://i.pinimg.com/736x/2c/e5/74/2ce5743603bf90f7049bb4814d5dd95a.jpg",
      centralTitle: "Multilingual Learning",
      postDescription: "Our content is created and reviewed by native speakers to ensure clarity, cultural relevance, and accuracy. This helps learners grasp technical and complex topics without feeling lost.",
      comments: [
      
      ],
      randomImages: [
        {
          src: "/hindi.png",
          position: "top-[20%] right-[15%]",
          size: "h-20"
        },
        {
          src: "https://www.nicepng.com/png/full/247-2477108_vinayagar-images-png.png",
          position: "top-[70%] left-[15%]",
          size: " h-14"
        },
        {
          src: "/eng.png",
          position: "top-[12%] left-[22%]",
          size: "h-10"
        },
        {
          src: "/mar.png",
          position: "bottom-[28%] right-[22%]",
          size: "h-12"
        }
      ],
      sideText: "No matter where you're from, you can now access quality education without the language barrier holding you back.",
      leftDescription: "Learning becomes easier when it's in a language you understand best. That's why we provide lessons in multiple regional languages, including Odia, so you can focus on concepts—not translations."
    },
    Skills: {
      title: "Why Is Toperly Different",
      centralImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop",
      centralTitle: "Skill Hub",
      postDescription: "Hands-on projects let you apply what you've learned in real-world scenarios, building confidence for interviews and actual job tasks.",
      comments: [

      ],
       randomImages: [
        {
          src: "https://images.icon-icons.com/2699/PNG/512/python_logo_icon_168886.png",
          position: "top-[4%] left-[15%]",
          size: "h-24"
        },
        {
          src: "https://static.vecteezy.com/system/resources/previews/022/100/214/non_2x/java-logo-transparent-free-png.png",
          position: "top-[65%] left-[20%]",
          size: "h-40"
        },
        {
          src: "https://www.freeiconspng.com/uploads/c--logo-icon-0.png",
          position: "top-[20%] right-[15%]",
          size: "h-20"
        },
        {
          src: "https://www.syntonize.com/wp-content/uploads/2024/01/7746A535-AC40-442A-9627-ADAD756DCF82.png",
          position: "bottom-[25%] right-[20%]",
          size: "h-24"
        }
      ],
      sideText: "From beginner-friendly introductions to advanced mastery, you'll be prepared for high-demand roles across industries",
      leftDescription: "We focus on skills that match what companies are looking for today. Every course is designed with industry experts to ensure what you learn is useful in the workplace."
    },
    Community: {
      title: "Why Is Toperly Different",
      centralImage: "https://i.pinimg.com/1200x/06/fa/cd/06facdcb60ea58713eafb59fb13f0dab.jpg",
      centralTitle: "Student Community",
      postDescription: "Ask questions, share your achievements, and get instant feedback from peers who understand your journey.",
      comments: [
        {
          id: 1,
          name: "Emma Wilson",
          handle: "@emmawilson",
          message: "The community made me feel like I'm not learning alone",
          avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=50&h=50&fit=crop&crop=face",
          verified: true,
        },
        {
          id: 2,
          name: "Alex Thompson",
          handle: "@alexthompson",
          message: "I've made friends here who are as passionate as I am.",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face",
          verified: false,
        }
      ],
      randomImages: [
      ],
      sideText: "When motivation drops, the community is there to lift you up and keep you moving forward.",
      leftDescription: "A strong community makes learning more enjoyable. Join thousands of learners and mentors who support each other at every step."
    },
    more: {
      title: "Why Is Toperly Different",
      centralImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
      centralTitle: "Certificate & much more",
      postDescription: "Display them proudly on LinkedIn, resumes, or portfolios to stand out in a competitive job market.",
      comments: [],
      randomImages: [
        {
          src: "https://clipart-library.com/img1/1053315.png",
          position: "top-[7%] left-[22%]",
          size: "h-28"
        },
        {
          src: "https://static.vecteezy.com/system/resources/previews/021/358/803/original/artificial-intelligence-icon-element-design-illustration-ai-technology-and-cyber-icon-element-futuristic-technology-service-and-communication-artificial-intelligence-concept-png.png",
          position: "top-[15%] right-[15%]",
          size: "h-24"
        },
        {
          src: "https://www.pngmart.com/files/22/Social-Network-PNG-Free-Download.png",
          position: "bottom-[20%] left-[10%]",
          size: "h-48"
        },
        {
          src: "https://www.freeiconspng.com/uploads/idea-icon-11.png",
          position: "bottom-[25%] right-[25%]",
          size: "h-24"
        }
      ],
      sideText: "Each certificate is a recognition of your hard work and dedication, adding credibility to your professional profile.",
      leftDescription: "Earn certificates that prove your skills and showcase your achievements to employers and clients."
    }
  };

  // Navigation tabs data
 const navTabs = [
  { name: "Languages", icon: Languages, color: "bg-gradient-to-r from-blue-300 to-blue-500", activeColor: "bg-gradient-to-r from-blue-600 to-blue-800", id: "Languages" },
  { name: "Skills",  icon: Power, color: "bg-gradient-to-r from-purple-300 to-purple-500", activeColor: "bg-gradient-to-r from-purple-600 to-purple-800", id: "Skills" },
  { name: "Community",  icon: Group, color: "bg-gradient-to-r from-pink-300 to-pink-500", activeColor: "bg-gradient-to-r from-pink-600 to-pink-800", id: "Community" },
  { name: "Certificates & more",  icon: Dock, color: "bg-gradient-to-r from-orange-300 to-orange-500", activeColor: "bg-gradient-to-r from-orange-600 to-orange-800", id: "more" },
];

  const currentContent = contentData[activeTab];

  const handleTabChange = (newTab: string) => {
    if (newTab === activeTab) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(newTab);
      setIsTransitioning(false);
    }, 400);
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 via-blue-200 to-purple-50 relative overflow-x-hidden">
      
      {/* Main Title */}
      <div className="text-center pt-16 md:pt-24 px-4 relative z-20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-gray-800 tracking-tight mb-8 md:mb-10">
          {currentContent.title}
        </h1>

        {/* Navigation Tags */}
        <div className="w-full flex flex-wrap md:justify-center overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 md:gap-3 mb-8 md:mb-0 px-2 md:px-0">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 rounded-full text-white text-md md:text-normal font-medium transition-all duration-300 hover:scale-105 whitespace-nowrap ${
                  tab.id === activeTab ? tab.activeColor : tab.color
                }`}
              >
                <Icon size={16} />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>
      </div>

      {/* Main Content Container */}
      <div className={`relative  h-[400px] md:h-[600px] max-w-7xl mx-auto px-4 transition-all duration-500 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}>
        
        {/* Central Glass Container */}
        <div className="absolute top-1/2 left-1/2 -mt-4 md:mt-0 transform -translate-x-1/2 -translate-y-1/2 z-10 w-full md:w-auto px-4">
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 md:p-6 border border-white/30 shadow-2xl w-full max-w-sm mx-auto md:w-96">
            {/* Title above image */}
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 text-left">
              {currentContent.centralTitle}
            </h3>
            
            {/* Central Image */}
            <div className="rounded-2xl overflow-hidden mb-4">
              <img 
                src={currentContent.centralImage} 
                alt={currentContent.centralTitle}
                className="w-full h-56 md:h-80 object-cover"
              />
            </div>

            {/* Stats */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm text-gray-700">
                  {currentContent.postDescription}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Random Images */}
        <div className="absolute inset-0 pointer-events-none">
          {currentContent.randomImages.map((image, index) => (
            <img
              key={index}
              src={image.src}
              alt={`Decorative ${index + 1}`}
              className={`absolute ${image.position} ${image.size} hidden md:block rounded-lg object-cover `}
            />
          ))}
        </div>

        {/* Left side description - hidden on mobile */}
        <div className="hidden md:block absolute top-1/3 left-4 transform -translate-y-1/2 max-w-xs">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20">
            <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
              {currentContent.leftDescription}
            </p>
          </div>
        </div>

        {/* Right side text - hidden on mobile */}
        <div className="hidden md:block absolute bottom-16 right-4 md:right-8 max-w-xs">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 md:p-4 border border-white/20">
            <p className="text-gray-700 text-xs md:text-sm leading-relaxed text-right">
              {currentContent.sideText}
            </p>
          </div>
        </div>

        {/* Comments - positioned responsively */}
        <div className="hidden md:block absolute inset-0 pointer-events-none">
          {currentContent.comments.map((comment, index) => (
            <div 
              key={comment.id}
              className={`absolute z-50 w-48 md:w-60 ${
                index === 0 ? 'top-[30%] md:top-[55%] left-0 md:left-[17%]' : 
                'top-[60%] md:top-[25%] right-0 md:right-[17%]'
              }`}
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 md:p-4 border border-white/30 shadow-lg pointer-events-auto">
                <div className="flex items-start gap-2 md:gap-3">
                  <img 
                    src={comment.avatar}
                    alt={comment.name}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-1 md:gap-2 mb-1">
                      <span className="font-semibold text-gray-800 text-xs md:text-sm">{comment.name}</span>
                      {comment.verified && (
                        <div className="w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 block mb-1 md:mb-2">{comment.handle}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed mt-1">
                      {comment.message}
                    </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualDevicesDashboard;