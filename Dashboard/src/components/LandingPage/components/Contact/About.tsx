import React from "react";

const milestones = [
  {
    year: "2008",
    title: "Technology Solutions",
    description: "Pioneering integrated tech for modern businesses. Delivering scalable, innovative results since 2008.",
    color: "bg-blue-600",
    hoverColor: "bg-gradient-primary hover:shadow-glow-primary",
  },
  {
    year: "2008",
    title: "Financial Consulting",
    description: "Expert guidance to optimize your financial performance,  Delivering scalable, innovative results since 2008.",
    color: "bg-gray-100",
    hoverColor: "hover:bg-gray-300",
  },
  {
    year: "2008",
    title: "Financial Consulting",
    description: "Expert guidance to optimize your financial performance,  Delivering scalable, innovative results since 2008.",
    color: "bg-gray-100",
    hoverColor: "hover:bg-gray-300",
  },
];

export default function ExpertisePage() {
  return (
    <div className="min-h-full bg-white py-8 px-4 md:px-12 lg:px-14">
      {/* Top section */}
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Image */}
        <img
          className="w-full md:w-1/2 h-1/2 object-cover rounded-xl mb-4 md:mb-0"
          src="https://i.pinimg.com/1200x/2d/f3/f6/2df3f6e14b0c1e8dc690627a44c68a0c.jpg"
          alt="Professional Portrait"
        />
        {/* Text Block */}
        <div className="flex-1">
          <button className="mb-2 px-4 py-1 border border-gray-400 rounded-full text-xs text-gray-700">ABOUT US</button>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Unlock our expertise to drive success across {''}
             <span className="bg-gradient-primary bg-clip-text text-transparent">
              industries
            </span>
          </h2>
          <p className="text-gray-600 mb-5 text-justify md:mt-10">
            Lorem ipsum dolor sit amet, it maiores inventore natus, rem illum qui hic ea numquam ut dignissimos possimus quibusdam deserunt neque?
          </p>
        </div>
      </div>

      {/* Milestones Section */}
      <section className="mt-16">
        <button className="mb-2 px-4 py-1 border border-gray-400 rounded-full text-xs text-gray-700">MILESTONES</button>
        <div className="flex flex-col md:flex-col md:items-start">
          <h3 className="text-2xl md:text-3xl font-semibold mb-2">Our journey: key milestones and achievements</h3>
          <p className="text-gray-500 mb-4 md:mb-0 max-w-xl">
            Discover the significant milestones that have shaped our firm. Each achievement reflects our commitment to excellence and growth.
          </p>
        </div>
        {/* Grid of milestones */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {milestones.map((m, i) => (
            <div
              key={i}
              className={`
                group p-8 rounded-2xl shadow-md transition-colors duration-300
                cursor-pointer
                ${m.color} ${m.hoverColor}
                ${i === 0 ? "text-white" : "text-gray-900"}
              `}
            >
              {m.year && <div className="text-xl mb-2 font-bold">{m.year}</div>}
              <div className="text-lg font-semibold mb-1">{m.title}</div>
              <div className="text-sm">{m.description}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
