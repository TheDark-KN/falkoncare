import React, { useState } from 'react';
import { validateForm } from './validation-utils';
import './contact-support.css';

const ContactSupport = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateFormHandler = () => {
    const { isValid, errors } = validateForm(formData, 'contact');
    setErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateFormHandler()) {
      setIsSubmitting(true);

      // Simulate form submission
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });

        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      }, 1500);
    }
  };

  const supportOptions = [
    {
      id: 1,
      title: 'Booking Assistance',
      description: 'Need help with your booking? Our team is here to assist you.',
      icon: '📅',
      contact: 'bookings@watertankbooking.com'
    },
    {
      id: 2,
      title: 'Technical Support',
      description: 'Issues with the website or app? Get technical help here.',
      icon: '💻',
      contact: 'techsupport@watertankbooking.com'
    },
    {
      id: 3,
      title: 'Billing Inquiry',
      description: 'Questions about your bill or payment? Contact our billing team.',
      icon: '💳',
      contact: 'billing@watertankbooking.com'
    },
    {
      id: 4,
      title: 'Complaints & Feedback',
      description: 'Share your feedback or raise concerns with our service.',
      icon: '📝',
      contact: 'feedback@watertankbooking.com'
    }
  ];

  const faqs = [
    {
      question: 'How long does delivery take?',
      answer: 'Standard delivery takes 2-4 hours depending on your location. Express delivery is available for an additional fee.'
    },
    {
      question: 'What if I need to reschedule my delivery?',
      answer: 'You can reschedule your delivery up to 2 hours before the scheduled time through your account or by contacting support.'
    },
    {
      question: 'How do I know the water quality is good?',
      answer: 'All our water undergoes rigorous testing at NABL-accredited labs. We provide quality certificates with every delivery.'
    },
    {
      question: 'Can I get a refund if I\'m not satisfied?',
      answer: 'Yes, we offer a 100% satisfaction guarantee. Contact us within 24 hours of delivery for a full refund.'
    }
  ];

  return (
    <section className="contact-support" id="contact">
      <div className="container">
        <h2 className="section-title">Contact & Support</h2>
        <p className="section-subtitle">We're here to help you with any questions or concerns</p>

        <div className="contact-grid">
          <div className="contact-form-section">
            <h3>Send Us a Message</h3>
            {submitSuccess && (
              <div className="success-message">
                Thank you for your message! Our support team will get back to you within 24 hours.
              </div>
            )}
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this regarding?"
                />
                {errors.subject && <span className="error-message">{errors.subject}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your issue or inquiry"
                  rows="5"
                ></textarea>
                {errors.message && <span className="error-message">{errors.message}</span>}
              </div>

              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          <div className="contact-info-section">
            <h3>Get In Touch</h3>
            <div className="contact-options">
              {supportOptions.map(option => (
                <div key={option.id} className="contact-option">
                  <div className="option-icon">{option.icon}</div>
                  <div className="option-details">
                    <h4>{option.title}</h4>
                    <p>{option.description}</p>
                    <a href={`mailto:${option.contact}`} className="contact-link">
                      {option.contact}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="contact-details">
              <div className="detail-item">
                <div className="detail-icon">📞</div>
                <div>
                  <h4>Phone Support</h4>
                  <a href="tel:+91-9876543210" className="contact-link">+91-9876543210</a>
                  <p>Available 24/7 for emergency support</p>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-icon">🕒</div>
                <div>
                  <h4>Business Hours</h4>
                  <p>Monday - Friday: 6:00 AM - 10:00 PM</p>
                  <p>Saturday - Sunday: 7:00 AM - 9:00 PM</p>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-icon">📍</div>
                <div>
                  <h4>Head Office</h4>
                  <p>123 Water Avenue, Sector 45</p>
                  <p>New Delhi, India - 110045</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="faq-section">
          <h3>Frequently Asked Questions</h3>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <div className="faq-question">
                  <h4>{faq.question}</h4>
                </div>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="emergency-support">
          <div className="emergency-content">
            <h3>Emergency Support</h3>
            <p>Need immediate assistance? Our emergency support team is available 24/7 for urgent issues.</p>
            <a href="tel:+91-9876543210" className="btn btn-emergency">
              Call Emergency Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSupport;