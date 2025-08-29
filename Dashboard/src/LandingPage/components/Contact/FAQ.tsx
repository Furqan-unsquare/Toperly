import React, { useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "What is finance analytics and how can it help my business?",
    answer:
      "Finance analytics helps you understand your financial data better, so you can make smarter decisions, spot trends, and improve your business strategy.",
  },
  {
    question: "How do I start using your finance analytics platform?",
    answer: [
      "Sign up for an account on our platform",
      "Connect your financial data sources",
      "Explore our dashboard and analytics tools",
      "Set up custom reports and alerts",
    ],
  },
  {
    question: "What types of financial data can I analyze?",
    answer:
      "Our platform supports analysis of revenue, expenses, cash flow, investments, and more from various sources including banks, accounting software, and spreadsheets.",
  },
  {
    question: "Is my financial data secure?",
    answer:
      "Yes, we use bank-level encryption and follow strict security protocols to ensure your data remains private and protected at all times.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0); // First FAQ open by default

  const toggleFAQ = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  const variants = {
    open: {
      height: 'auto',
      opacity: 1,
      transition: {
        type: 'spring',
        bounce: 0,
        duration: 0.5,
      }
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        type: 'spring',
        bounce: 0,
        duration: 0.3,
      }
    }
  };

  return (
    <section className="bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-16 min-h-full flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* LEFT */}
        <div className="flex flex-col justify-start h-full space-y-6">
          <span className="inline-block p-1 px-3 border border-blue-500 text-xs font-medium rounded-lg w-fit">
            Daily Questions
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Frequently asked <br />
            <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              questions
            </span>
          </h1>
          
          <div className="bg-purple-100/60 rounded-2xl p-6 mt-auto max-w-md shadow-sm border border-purple-200 text-left">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Still have a question?
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Can't find the answer to your question? Send us an email and we'll get back to you as soon as possible!
            </p>
            <button className="flex items-center px-5 py-2.5 hover:text-gray-600 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-[#0c9279] hover:to-[#66E4CC] text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2">
              Send email
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full">
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-xl shadow-sm transition-all duration-200 cursor-pointer border border-gray-200 overflow-hidden ${
                  openIndex === idx
                    ? 'border-purple-500 shadow-md'
                    : 'hover:border-purple-400 hover:shadow'
                }`}
              >
                <button
                  className="flex justify-between items-center px-5 py-4 sm:px-6 sm:py-5 w-full text-left focus:outline-none focus:rounded-xl"
                  onClick={() => toggleFAQ(idx)}
                  aria-expanded={openIndex === idx}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <span className="font-medium text-gray-800 text-base sm:text-lg">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === idx ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowDown
                      className={`w-5 h-5 ${
                        openIndex === idx ? 'text-purple-600' : 'text-gray-500'
                      }`}
                    />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === idx && (
                    <motion.div
                      id={`faq-answer-${idx}`}
                      variants={variants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      className="px-5 sm:px-6 overflow-hidden"
                      layout
                    >
                      <div className="pb-5 sm:pb-6 text-gray-600">
                        {Array.isArray(faq.answer) ? (
                          <ul className="list-disc pl-6 space-y-2">
                            {faq.answer.map((item, i) => (
                              <li key={i} className="text-sm sm:text-base">{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm sm:text-base">{faq.answer}</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;