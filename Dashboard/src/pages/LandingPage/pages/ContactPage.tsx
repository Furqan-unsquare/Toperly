import React, { useState } from 'react';
import Hero from '../../../components/LandingPage/components/Contact/Hero';
import ContactForm from '../../../components/LandingPage/components/Contact/ContactForm';
import About from '../../../components/LandingPage/components/Contact/About';
import CTA from '../../../components/LandingPage/components/Contact/CTA';
import FAQSection from '../../../components/LandingPage/components/Contact/FAQ';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const courses = [
    'AI & Machine Learning Bootcamp',
    'Data Science Masterclass',
    'Full Stack Development',
    'Digital Marketing Pro',
    'UI/UX Design Workshop',
    'Python Programming',
    'Other'
  ];


  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.course) newErrors.course = 'Please select a course';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          course: '',
          message: '',
          inquiryType: 'general'
        });
      }, 3000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div>
      <Hero  />
      {/* <About /> */}
      {/* <ContactForm 
        formData={formData}
        errors={errors}
        isSubmitted={isSubmitted}
        courses={courses}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />       */}
      <FAQSection />
      {/* <CTA />      */}
    </div>
  );
};

export default ContactPage;