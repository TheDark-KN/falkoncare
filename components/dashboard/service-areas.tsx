import React, { useState } from 'react';
import './service-areas.css';

const ServiceAreas = () => {
  const [selectedArea, setSelectedArea] = useState(null);
  
  const serviceAreas = [
    {
      id: 1,
      name: 'Downtown District',
      coverage: '100%',
      deliveryTime: 'Within 2 hours',
      description: 'Full coverage of downtown business district and residential areas',
      neighborhoods: ['Central Business District', 'Riverside', 'Old Town', 'Financial Plaza']
    },
    {
      id: 2,
      name: 'Northside Suburbs',
      coverage: '95%',
      deliveryTime: 'Within 3 hours',
      description: 'Covers major residential communities in the north',
      neighborhoods: ['Green Valley', 'Oak Park', 'Sunset Hills', 'Pine Ridge']
    },
    {
      id: 3,
      name: 'East End',
      coverage: '85%',
      deliveryTime: 'Within 4 hours',
      description: 'Growing residential and commercial area',
      neighborhoods: ['Millennium Park', 'Harbor View', 'Tech Corridor', 'University District']
    },
    {
      id: 4,
      name: 'Westside Communities',
      coverage: '90%',
      deliveryTime: 'Within 3 hours',
      description: 'Mixed-use developments and family neighborhoods',
      neighborhoods: ['Willow Creek', 'Maple Grove', 'Cedar Heights', 'Birchwood']
    },
    {
      id: 5,
      name: 'South Region',
      coverage: '80%',
      deliveryTime: 'Within 4 hours',
      description: 'Expanding service to newer residential areas',
      neighborhoods: ['Desert Bloom', 'Mountain View', 'Canyon Rim', 'Adobe Gardens']
    },
    {
      id: 6,
      name: 'Airport Zone',
      coverage: '100%',
      deliveryTime: 'Within 2 hours',
      description: 'Priority service for hotels and businesses near airport',
      neighborhoods: ['Airport Commercial', 'Hotel District', 'Trade Center', 'Executive Park']
    }
  ];

  const availabilityHours = [
    { day: 'Monday - Friday', hours: '6:00 AM - 10:00 PM' },
    { day: 'Saturday', hours: '7:00 AM - 9:00 PM' },
    { day: 'Sunday', hours: '8:00 AM - 8:00 PM' }
  ];

  return (
    <section className="service-areas" id="services">
      <div className="container">
        <h2 className="section-title">Our Service Areas</h2>
        <p className="section-subtitle">We serve communities across the region with reliable water delivery</p>

        <div className="availability-info">
          <div className="hours-card">
            <h3>Delivery Hours</h3>
            <ul className="hours-list">
              {availabilityHours.map((item, index) => (
                <li key={index} className="hour-item">
                  <span className="day">{item.day}</span>
                  <span className="time">{item.hours}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="coverage-card">
            <h3>Service Coverage</h3>
            <div className="coverage-stats">
              <div className="stat">
                <div className="stat-number">95%</div>
                <div className="stat-label">City Coverage</div>
              </div>
              <div className="stat">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Emergency Support</div>
              </div>
              <div className="stat">
                <div className="stat-number">2H</div>
                <div className="stat-label">Avg Response</div>
              </div>
            </div>
          </div>
        </div>

        <div className="areas-grid">
          {serviceAreas.map(area => (
            <div 
              key={area.id} 
              className={`area-card ${selectedArea === area.id ? 'expanded' : ''}`}
              onClick={() => setSelectedArea(selectedArea === area.id ? null : area.id)}
            >
              <div className="area-header">
                <h3>{area.name}</h3>
                <div className="area-meta">
                  <span className="coverage">Coverage: {area.coverage}</span>
                  <span className="delivery">Delivery: {area.deliveryTime}</span>
                </div>
              </div>
              
              <p className="area-description">{area.description}</p>
              
              {selectedArea === area.id && (
                <div className="area-details">
                  <h4>Neighborhoods Served:</h4>
                  <ul className="neighborhoods-list">
                    {area.neighborhoods.map((neighborhood, idx) => (
                      <li key={idx}>{neighborhood}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="area-footer">
                <button className="btn btn-outline">Check Availability</button>
              </div>
            </div>
          ))}
        </div>

        <div className="service-map">
          <h3 className="section-title">Service Area Map</h3>
          <div className="map-container">
            <div className="map-placeholder">
              <p>Interactive map showing service coverage areas</p>
              <div className="map-legend">
                <div className="legend-item">
                  <div className="legend-color legend-full"></div>
                  <span>100% Coverage</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color legend-high"></div>
                  <span>90-99% Coverage</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color legend-medium"></div>
                  <span>80-89% Coverage</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color legend-low"></div>
                  <span>Below 80% Coverage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreas;