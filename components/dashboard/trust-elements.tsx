import React from 'react';
import './trust-elements.css';

const TrustElements = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      location: 'Delhi',
      rating: 5,
      text: 'The water quality is exceptional and the delivery is always on time. I\'ve been using their service for over a year now and never had any issues.',
      avatar: 'RK'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      location: 'Mumbai',
      rating: 5,
      text: 'Excellent service! The booking process is so simple and the team is very professional. Water is always fresh and clean.',
      avatar: 'PS'
    },
    {
      id: 3,
      name: 'Amit Patel',
      location: 'Ahmedabad',
      rating: 4,
      text: 'Reliable water delivery service. The pricing is transparent and there are no hidden charges. Highly recommended!',
      avatar: 'AP'
    },
    {
      id: 4,
      name: 'Sunita Reddy',
      location: 'Hyderabad',
      rating: 5,
      text: 'I appreciate their commitment to quality. The water tastes great and the delivery guys are always polite and punctual.',
      avatar: 'SR'
    },
    {
      id: 5,
      name: 'Vikram Singh',
      location: 'Bangalore',
      rating: 5,
      text: 'Best water delivery service in the city. Their mineral water is pure and the customer service is outstanding.',
      avatar: 'VS'
    },
    {
      id: 6,
      name: 'Meera Nair',
      location: 'Kochi',
      rating: 5,
      text: 'I\'ve tried several water delivery services but none match the quality and reliability of this company. Worth every penny!',
      avatar: 'MN'
    }
  ];

  const certifications = [
    {
      id: 1,
      name: 'ISO 22000',
      description: 'Food Safety Management System',
      icon: '🛡️'
    },
    {
      id: 2,
      name: 'BIS Certification',
      description: 'Bureau of Indian Standards',
      icon: '✅'
    },
    {
      id: 3,
      name: 'FSSAI License',
      description: 'Food Safety and Standards Authority',
      icon: '📋'
    },
    {
      id: 4,
      name: 'NABL Accredited',
      description: 'National Accreditation Board Lab',
      icon: '🔬'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '98%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'Support Available' },
    { number: '500+', label: 'Cities Served' }
  ];

  return (
    <section className="trust-elements" id="testimonials">
      <div className="container">
        <h2 className="section-title">Trusted by Thousands</h2>
        <p className="section-subtitle">See what our customers say about our service</p>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="testimonials-grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="rating">
                {'★'.repeat(testimonial.rating)}
                {'☆'.repeat(5 - testimonial.rating)}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <div className="avatar">{testimonial.avatar}</div>
                <div className="author-info">
                  <div className="author-name">{testimonial.name}</div>
                  <div className="author-location">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="certifications-section">
          <h3 className="section-title">Our Certifications</h3>
          <p className="section-subtitle">Committed to quality and safety standards</p>
          
          <div className="certifications-grid">
            {certifications.map(cert => (
              <div key={cert.id} className="certification-card">
                <div className="cert-icon">{cert.icon}</div>
                <h4>{cert.name}</h4>
                <p>{cert.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="quality-assurance">
          <h3 className="section-title">Quality Assurance Process</h3>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Source Testing</h4>
                <p>Water sourced from certified locations and tested for purity</p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Filtration Process</h4>
                <p>Multi-stage purification using advanced technology</p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Quality Control</h4>
                <p>Rigorous testing at every stage of processing</p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Sealed Packaging</h4>
                <p>Hygienic packaging to maintain quality during transport</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustElements;