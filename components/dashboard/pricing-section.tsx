import React from 'react';
import './pricing-section.css';

const PricingSection = () => {
  const tankOptions = [
    {
      size: '500 Liters',
      price: '₹300',
      description: 'Perfect for small families or offices',
      features: ['Standard purification', 'Basic delivery', '1-2 day notice']
    },
    {
      size: '1000 Liters',
      price: '₹550',
      description: 'Ideal for medium-sized households',
      features: ['Advanced filtration', 'Priority delivery', 'Same day delivery'],
      popular: true
    },
    {
      size: '1500 Liters',
      price: '₹750',
      description: 'Great for larger families',
      features: ['Premium filtration', 'Express delivery', 'Scheduled delivery']
    },
    {
      size: '2000 Liters',
      price: '₹950',
      description: 'Best for commercial use',
      features: ['Commercial grade purification', 'Guaranteed delivery', 'Flexible scheduling']
    },
    {
      size: '3000 Liters',
      price: '₹1350',
      description: 'Maximum capacity option',
      features: ['Hospital-grade purification', '24/7 delivery', 'Custom scheduling']
    }
  ];

  const waterTypes = [
    {
      type: 'Regular Water',
      description: 'Standard purified water for daily use',
      price: 'Included'
    },
    {
      type: 'Mineral Water',
      description: 'Natural minerals added for health benefits',
      price: '+₹50'
    },
    {
      type: 'Alkaline Water',
      description: 'pH-balanced water for enhanced hydration',
      price: '+₹100'
    }
  ];

  return (
    <section className="pricing-section" id="pricing">
      <div className="container">
        <h2 className="section-title">Transparent Pricing</h2>
        <p className="section-subtitle">No hidden fees, no surprises - just fair and competitive prices</p>

        <div className="pricing-tabs">
          <div className="tab-content active">
            <h3 className="tab-title">Tank Capacity Options</h3>
            <div className="pricing-grid">
              {tankOptions.map((option, index) => (
                <div 
                  key={index} 
                  className={`pricing-card ${option.popular ? 'popular' : ''}`}
                >
                  {option.popular && <div className="popular-badge">Most Popular</div>}
                  <div className="pricing-header">
                    <h3>{option.size}</h3>
                    <div className="price">{option.price}</div>
                    <p className="description">{option.description}</p>
                  </div>
                  <ul className="features-list">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="feature-item">
                        <span className="checkmark">✓</span> {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="btn btn-outline">Select Option</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="water-types-section">
          <h3 className="tab-title">Water Type Options</h3>
          <div className="water-types-grid">
            {waterTypes.map((water, index) => (
              <div key={index} className="water-type-card">
                <h4>{water.type}</h4>
                <p>{water.description}</p>
                <div className="water-price">{water.price}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pricing-features">
          <h3 className="tab-title">What's Included</h3>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🚚</div>
              <h4>Free Delivery</h4>
              <p>No delivery charges within service areas</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💧</div>
              <h4>Premium Quality</h4>
              <p>Multi-stage purification process</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⏰</div>
              <h4>On-Time Delivery</h4>
              <p>Guaranteed delivery within selected time slot</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🛡️</div>
              <h4>Quality Guarantee</h4>
              <p>100% satisfaction or money-back guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;