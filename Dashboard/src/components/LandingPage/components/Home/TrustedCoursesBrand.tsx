import React from 'react';

const TrustedCoursesBrand = () => {
  const trustFactors = [
   
    {
      img: 'https://s2-recruiting.cdn.greenhouse.io/external_greenhouse_job_boards/logos/401/021/300/original/edx_2u_logo.png?1658949982',
      title: '500K+ Alumni Network',
    },
    {
      img: 'https://vectorseek.com/wp-content/uploads/2023/10/Udacity-Logo-Vector.svg-.png',
      title: '10+ Years Experience',
    }, {
      img: 'https://purepng.com/public/uploads/large/purepng.com-microsoft-logologobrand-logoiconslogos-251519939132du80p.png',
      title: 'Industry-Recognized Certifications',
    },
    {
      img: 'http://pluspng.com/img-png/logo-ibm-png-ibm-logo-png-4464.png',
      title: 'Project-Based Learning',
    },
    {
      img: 'https://www.freepnglogos.com/uploads/linkedin-logo-transparent-png-25.png',
      title: 'Placement Support',
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trusted by <span className="text-blue-600">50,000+</span> Learners Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join India's most awarded tech education platform with industry-aligned programs
          </p>

          {/* Horizontal logos section */}
          <div className="mt-12 overflow-x-auto">
            <div className="flex flex-nowrap justify-center gap-10 min-w-max">
              {trustFactors.map((factor, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center min-w-[120px]"
                >
                  <img
                    src={factor.img}
                    alt={factor.title}
                    className="h-12 w-auto object-contain mb-2"
                  />
                  {/* <p className="text-sm text-gray-600 mt-1">{factor.title}</p> */}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TrustedCoursesBrand;
