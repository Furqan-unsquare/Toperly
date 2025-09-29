import React from 'react';

const AIToolsShowcase = () => {
  const tools = [
    { name: 'Copilot', img: 'https://d2o2utebsixu4k.cloudfront.net/Microsoft%20Copilot%20(1)-6937e350e348418cb9997ca1ab308af9.svg', gradient: 'from-blue-400 to-pink-400' },
    { name: 'Excel', img: 'https://d2o2utebsixu4k.cloudfront.net/Excel_36x36-868bf09311084d559b7cdd472a02b49e.svg', gradient: 'from-green-600 to-green-400' },
    { name: 'Chat GPT', img: 'https://d2o2utebsixu4k.cloudfront.net/Chat%20GPT%2036x36%20(1)-0f7479db28a94d109b70e39f06602a55.svg', gradient: 'from-teal-500 to-emerald-400' },
    { name: 'GH Copilot', img: 'https://d2o2utebsixu4k.cloudfront.net/Github%20Copilot%2036x36-f178b8a492784535b81c5ad3168e71a1.svg', gradient: 'from-gray-700 to-gray-500' },
    { name: 'Midjourney', img: 'https://d2o2utebsixu4k.cloudfront.net/Midjourney-7a4cf09168dc4f9f825b0460f4f436d9.svg', gradient: 'from-purple-500 to-pink-500' },
    { name: 'ElevenLabs', img: 'https://d2o2utebsixu4k.cloudfront.net/ElevenLabs%2036x36-6f3d4d4df37340938505c16285d451ac.svg', gradient: 'from-indigo-600 to-blue-500' },
    { name: 'Runway', img: 'https://d2o2utebsixu4k.cloudfront.net/lloxzoo-01-1931e6f86f124683b260aa365204e9a4.svg', gradient: 'from-orange-500 to-red-500' },
    { name: 'n8n', img: 'https://d2o2utebsixu4k.cloudfront.net/lloxzoo-02-1f9c9607d3a54b0dbbce91f61f9a95a4.svg', gradient: 'from-pink-500 to-rose-500' },
    { name: 'Perplexity', img: 'https://d2o2utebsixu4k.cloudfront.net/Perplexity_32x32-8a9efbadb0874013a16ccfff8614d425.svg', gradient: 'from-blue-600 to-cyan-500' },
    { name: 'Lovable', img: 'https://d2o2utebsixu4k.cloudfront.net/lloxzoo-06-ff09bb7bfec849dc9ba7b890300cfdd5.svg', gradient: 'from-red-500 to-pink-500' },
    { name: 'HeyGen', img: 'https://d2o2utebsixu4k.cloudfront.net/lloxzoo-04-19c04acb0a764a6ea831a44e3d459b53.svg', gradient: 'from-cyan-500 to-blue-600' },
    { name: 'Synthesia', img: 'https://d2o2utebsixu4k.cloudfront.net/LOGO%20HH-0c213402c3404aadb0da0712a092ddc7.svg', gradient: 'from-slate-700 to-gray-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <p className="text-sm sm:text-base text-gray-600 mb-2">
            Master AI Tools With Our Gen AI Course
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Master <span className="text-red-500">15+ Top AI tools</span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 max-w-3xl mx-auto">
            Become an expert in Microsoft 365 Copilot, Chat GPT, Eleven Labs, and many more. 
            Get access to GPT 4.0 credits worth 499.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="bg-black rounded-3xl p-6 sm:p-8 lg:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-4">
            {tools.map((tool, index) => (
              <div
                key={index}
                className="group relative aspect-square bg-gradient-to-br from-[#3E3E3E] rounded-2xl p-4 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-2xl hover:shadow-gray-900/80 cursor-pointer"
              >
                {/* Icon Container */}
                {/* <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${tool.gradient} rounded-xl flex items-center justify-center mb-3 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`}>
                  {tool.icon}
                </div> */}
                <img src={tool.img} alt="" 
                className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center mb-3 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`}/>
                
                {/* Tool Name */}
                <h3 className="text-white font-semibold text-xs sm:text-sm lg:text-base text-center">
                  {tool.name}
                </h3>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/10 transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Optional CTA Section */}
        <div className="text-center mt-12">
          <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg">
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIToolsShowcase;