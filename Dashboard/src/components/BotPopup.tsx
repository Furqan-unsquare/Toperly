import React, { useState, useEffect } from 'react';

const BotPopup = ({
  isOpen,
  onClose,
  studentName = "[Student Name]",
  title = "Awesome! Time to dive in and have some fun!",
  description = "Let the journey begin and always remember, I'm there with you!",
  buttonText = "Let's Start",
  buttonLink = "#",
  onButtonClick,
  botImage = "/bot-image.jpg"
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 100);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else if (buttonLink && buttonLink !== "#") {
      window.open(buttonLink, "_blank");
    }
  };

  if (!isVisible) return null;

  return (
    <>
    <style jsx>{`
        @keyframes shine {
          0% { left: -75%; }
          100% { left: 125%; }
        }
        .shine-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -75%;
          height: 120%;
          width: 10%;
          background: rgba(255, 255, 255, 0.2);
          transform: rotate(12deg);
          filter: blur(8px);
          z-index: 10;
          animation: shine 2s linear infinite;
        }
      `}</style>
    <div className="fixed inset-0 z-[51] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Popup Container */}
      <div className={`
        relative w-full max-w-md mx-auto
        transform transition-all duration-300 ease-out
        ${isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}
      `}>
        {/* Main Popup */}
        <div className="relative bg-gradient-to-b from-yellow-100 to-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Top Section with Bot */}
          <div className="relative">
            {/* Decorative Elements */}
            <div className="absolute top-4 left-8 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="absolute top-8 right-12 w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute top-12 left-16 w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-6 right-20 w-2 h-2 bg-pink-400 transform rotate-45 animate-pulse"></div>
            <div className="absolute top-16 left-12 w-1.5 h-1.5 bg-indigo-400 transform rotate-45 animate-pulse" style={{animationDelay: '1.5s'}}></div>

            {/* Bot Container */}
            <div className="flex justify-center relative">
              <img src={botImage}/>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-8 py-6 bg-white">
            {/* Greeting */}
            <div className="text-center mb-4 animate-fadeInUp" style={{animationDelay: '0.5s'}}>
              <p className="text-gray-600 text-sm">Hi {studentName},</p>
            </div>

            {/* Title */}
            <div className="text-center mb-4 animate-fadeInUp" style={{animationDelay: '0.7s'}}>
              <h2 className="text-xl font-bold text-gray-800 leading-tight">
                {title}
              </h2>
            </div>

            {/* Description */}
            <div className="text-center mb-6 animate-fadeInUp" style={{animationDelay: '0.9s'}}>
              <p className="text-gray-600 text-sm leading-relaxed">
                {description}
              </p>
            </div>

            {/* Updated Button with Shine Effect */}
            <div className="text-center animate-fadeInUp" style={{animationDelay: '1.1s'}}>
              <button
                onClick={handleButtonClick}
                className="shine-button relative cursor-pointer w-full py-4 px-8 text-center font-semibold inline-flex justify-center text-lg uppercase text-white rounded-lg border-solid transition-transform duration-300 ease-in-out group outline-offset-4 focus:outline focus:outline-2 focus:outline-white focus:outline-offset-4 overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <span className="relative z-20 flex items-center gap-2">
                  {buttonText}
                </span>
              </button>
            </div>
          </div>

          {/* Bottom Decorative Wave */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-200 animate-pulse"></div>
        </div>
      </div>
    </div>
    </>
  );
};

export default BotPopup;
