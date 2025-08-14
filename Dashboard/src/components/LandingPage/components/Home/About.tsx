import React, { useState, useEffect, useRef } from 'react';
import { Download, Menu, X, MessageCircle, Heart, MoreHorizontal, Send, Sparkles } from 'lucide-react';

// Custom hook for intersection observer
const useInView = (threshold = 0.1, rootMargin = '0px') => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Optional: Stop observing after first trigger
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin]);

  return [ref, isInView];
};

const AIChatInterface = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [showNewMessage, setShowNewMessage] = useState(false);
  
  // Intersection Observer hooks for different sections
  const [headerRef, headerInView] = useInView(0.3);
  const [leftColumnRef, leftColumnInView] = useInView(0.2);
  const [chatRef, chatInView] = useInView(0.2);
  const [messageRef, messageInView] = useInView(0.4);
  const [cardRef, cardInView] = useInView(0.3);
  const [bottomChatRef, bottomChatInView] = useInView(0.2);

  const getBackgroundStyle = () => {
    return {
      background: `
        radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, #000000 100%, #0f172a 0%)
      `,
    };
  };

  // Trigger typing animation when card comes into view
  useEffect(() => {
    if (cardInView && !isTyping && !showNewMessage) {
      const timer = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessageText("Thanks for your interest! I'd love to discuss art with you. What specific aspects are you curious about?");
          setShowNewMessage(true);
        }, 3000);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [cardInView, isTyping, showNewMessage]);

  return (
    <div className="w-full min-h-full bg-gradient-to-b from-[#080D1A] via-gray-900 to-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="min-h-full -mt-10 bg-gradient-to-br from-blue-400/50 via-blue-200/30 to-purple-400/30 relative rounded-t-2xl overflow-hidden">
        
        {/* Enhanced Background Glows with Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 right-20 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-r from-purple-300 to-pink-300/40 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-60 right-40 w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-gradient-to-r from-blue-300 to-indigo-300/30 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-80 right-60 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-r from-cyan-300 to-blue-300/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          {/* Floating Particles */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 2}s`,
                boxShadow: '0 0 10px rgba(79, 70, 229, 0.5)'
              }}
            />
          ))}
        </div>

        {/* Animated overlay */}
        <div 
          ref={headerRef}
          className={`absolute inset-0 bg-gray-50 backdrop-blur-md rounded-t-2xl border border-white/20 -lg z-10 transition-all duration-1000 ${
            headerInView ? 'animate-fadeIn' : 'opacity-0'
          }`} 
        />

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Left Column - Text Content with Scroll Animations */}
            <div 
              ref={leftColumnRef}
              className={`lg:col-span-5 space-y-6 sm:space-y-8 transition-all duration-1000 ${
                leftColumnInView ? 'animate-slideInLeft' : 'opacity-0 transform translate-x-[-100px]'
              }`}
            >
              <div className="space-y-4 sm:space-y-6">
                
                {/* Animated badge */}
                <div className={`inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm rounded-full px-4 py-2 border border-indigo-200/50 transition-all duration-700 ${
                  leftColumnInView ? 'animate-slideInDown' : 'opacity-0 transform translate-y-[-50px]'
                }`}>
                  <Sparkles className="w-4 h-4 text-indigo-600 animate-spin-slow" />
                  <span className="text-xs sm:text-sm text-indigo-700 font-medium">Powered by ChatGPT 4</span>
                </div>
                
                <div className={`transition-all duration-1000 delay-200 ${
                  leftColumnInView ? 'animate-slideInUp' : 'opacity-0 transform translate-y-[50px]'
                }`}>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 leading-tight animate-gradient bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 bg-clip-text">
                    The Only AI For Respond 
                  </h1>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 leading-tight animate-gradient bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text">
                    To Your Messages
                  </h1>
                </div>
                
                <p className={`hidden md:block text-sm sm:text-base text-gray-600 leading-relaxed max-w-md transition-all duration-1000 delay-400 ${
                  leftColumnInView ? 'animate-slideInUp opacity-100' : 'opacity-0 transform translate-y-[50px]'
                }`}>
                  You can read and reply to private messages manually or trust our AI based on 
                  ChatGPT 4. The AI will also promote itself, increasing the number of followers and the 
                  reach of your posts.
                </p>
                
                <button className={`hidden md:flex bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold transition-all duration-1000 items-center space-x-2 shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 group delay-600 ${
                  leftColumnInView ? 'animate-slideInUp opacity-100' : 'opacity-0 transform translate-y-[50px]'
                }`}>
                  <span>See our plans</span>
                  <Download className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-bounce" />
                </button>
              </div>
            </div>

            {/* Right Column - Chat Interfaces with Scroll Animations */}
            <div className="lg:col-span-7 relative">
              
              {/* Main Chat Window */}
              <div 
                ref={chatRef}
                className={`relative z-10 mx-auto max-w-full sm:max-w-md lg:max-w-sm transition-all duration-1000 ${
                  chatInView ? 'animate-slideInRight' : 'opacity-0 transform translate-x-[100px]'
                }`}
              >
                
                {/* Chat Messages with Staggered Animation */}
                <div className="space-y-4 mb-6">
                  <div 
                    ref={messageRef}
                    className={`flex items-start space-x-3 transition-all duration-800 ${
                      messageInView ? 'animate-messageSlideIn' : 'opacity-0 transform translate-x-[-50px] scale-75'
                    }`}
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg animate-pulse">
                      Y
                    </div>
                    <div className="flex-1">
                      <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl rounded-tl-sm shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <div className="text-xs sm:text-sm font-medium text-gray-800 mb-1">Yuria Kitagawa</div>
                        <div className="text-xs sm:text-sm text-gray-600">That was super fast, thank you so much!</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ben Timona Chat Card with Enhanced Animations */}
                <div 
                  ref={cardRef}
                  className={`bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/60 mb-4 hover:scale-105 transition-all duration-1000 group ${
                    cardInView ? 'animate-cardSlideIn' : 'opacity-0 transform translate-y-[30px] scale-90'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full overflow-hidden shadow-lg ${
                        cardInView ? 'animate-avatarFloat' : ''
                      }`}>
                        <div className="w-full h-full bg-gradient-to-t from-gray-700/60 to-transparent flex items-center justify-center">
                          <div className="w-5 h-7 sm:w-6 sm:h-8 bg-gray-300 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-sm sm:text-base text-gray-900">Topsy</div>
                        <div className="text-xs sm:text-sm text-gray-500">Hey there!</div>
                      </div>
                    </div>
                    <button className={`bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-110 hover:shadow-lg ${
                      cardInView ? 'animate-buttonGlow' : ''
                    }`}>
                      Answer
                    </button>
                  </div>
                  
                  <div className="text-xs sm:text-sm text-gray-600 mb-3">
                    I want to ask you a question...
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-3 h-3 animate-pulse" />
                      <span>1 Message</span>
                    </div>
                    <span>09 Jun 2024</span>
                    <button className="text-indigo-600 hover:text-indigo-700 transition-colors duration-300 hover:underline">
                      View details →
                    </button>
                  </div>

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="mt-3 p-2 bg-gray-50 rounded-lg animate-fadeIn">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                        </div>
                        <span className="text-xs text-gray-500">AI is typing...</span>
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* New AI Response */}
                  {showNewMessage && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 animate-newMessage">
                      <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-indigo-700 mb-1">AI Assistant</div>
                          <div className="text-xs text-gray-700">{messageText}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Right Chat with Enhanced Animation */}
              <div 
                ref={bottomChatRef}
                className={`absolute bottom-0 right-0 w-64 sm:w-72 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/60 hidden sm:block hover:scale-105 transition-all duration-1000 group ${
                  bottomChatInView ? 'animate-slideInRight' : 'opacity-0 transform translate-x-[100px]'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full ${
                    bottomChatInView ? 'animate-avatarFloat delay-300' : ''
                  }`}></div>
                  <div className="flex-1">
                    <div className="text-xs sm:text-sm font-medium text-gray-800">hello dear!</div>
                    <div className="text-xs text-gray-500">Can we talk about art category?</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3 text-red-400 animate-pulse" />
                    <span>18 Like</span>
                  </div>
                  <span>4 Replies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        @keyframes slideInLeft {
          0% { transform: translateX(-100px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideInRight {
          0% { transform: translateX(100px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideInUp {
          0% { transform: translateY(50px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes slideInDown {
          0% { transform: translateY(-50px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes messageSlideIn {
          0% { transform: translateX(-50px) scale(0.8); opacity: 0; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }

        @keyframes cardSlideIn {
          0% { 
            transform: translateY(30px) scale(0.9); 
            opacity: 0; 
            box-shadow: 0 0 0 rgba(0,0,0,0);
          }
          100% { 
            transform: translateY(0) scale(1); 
            opacity: 1; 
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }
        }

        @keyframes avatarFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        @keyframes buttonGlow {
          0%, 100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
          50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.8), 0 0 30px rgba(99, 102, 241, 0.4); }
        }

        @keyframes newMessage {
          0% { 
            transform: translateY(20px) scale(0.95); 
            opacity: 0; 
          }
          50% { 
            transform: translateY(-5px) scale(1.02); 
          }
          100% { 
            transform: translateY(0) scale(1); 
            opacity: 1; 
          }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-fadeIn { animation: fadeIn 1s ease-out; }
        .animate-slideInLeft { animation: slideInLeft 1s ease-out; }
        .animate-slideInRight { animation: slideInRight 1s ease-out; }
        .animate-slideInUp { animation: slideInUp 1s ease-out; }
        .animate-slideInDown { animation: slideInDown 1s ease-out; }
        .animate-messageSlideIn { animation: messageSlideIn 1s ease-out; }
        .animate-cardSlideIn { animation: cardSlideIn 1s ease-out; }
        .animate-avatarFloat { animation: avatarFloat 3s ease-in-out infinite; }
        .animate-buttonGlow { animation: buttonGlow 2s ease-in-out infinite; }
        .animate-newMessage { animation: newMessage 0.8s ease-out; }
        .animate-gradient { 
          background-size: 200% 200%;
          animation: gradient 3s ease infinite; 
        }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }
        .delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  );
};

export default AIChatInterface;
