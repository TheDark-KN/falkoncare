import React, { useState, useEffect } from 'react';
import './order-tracking.css';

const OrderTracking = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [bookingStatus, setBookingStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock booking data
  const mockBookingData = {
    id: 'WT-2023-001234',
    customerName: 'Rajesh Kumar',
    location: 'Sector 45, Delhi',
    tankSize: '1000 Liters',
    waterType: 'Mineral Water',
    scheduledDate: '2023-06-15',
    scheduledTime: 'afternoon',
    status: 'in-transit',
    estimatedDelivery: '2023-06-15T14:30:00',
    driverName: 'Amit Sharma',
    driverPhone: '+91 9876543210',
    vehicleNumber: 'DL01AB1234'
  };

  const statusTimeline = [
    { id: 1, status: 'confirmed', title: 'Booking Confirmed', description: 'Your order has been confirmed', date: '2023-06-14 10:30 AM', completed: true },
    { id: 2, status: 'processing', title: 'Processing', description: 'Preparing your order', date: '2023-06-14 11:15 AM', completed: true },
    { id: 3, status: 'dispatched', title: 'Dispatched', description: 'Your order has been dispatched', date: '2023-06-15 08:00 AM', completed: true },
    { id: 4, status: 'in-transit', title: 'In Transit', description: 'On the way to your location', date: '2023-06-15 12:30 PM', completed: true },
    { id: 5, status: 'delivered', title: 'Delivered', description: 'Order delivered successfully', date: '', completed: false }
  ];

  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setBookingStatus(mockBookingData);
      setIsLoading(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return '#3b82f6';
      case 'processing': return '#60a5fa';
      case 'dispatched': return '#93c5fd';
      case 'in-transit': return '#f59e0b';
      case 'delivered': return '#10b981';
      default: return '#9ca3af';
    }
  };

  return (
    <div className="order-tracking-container">
      <div className="container">
        <h2 className="section-title">Track Your Order</h2>
        <p className="section-subtitle">Enter your booking ID to track your water tank delivery</p>
        
        <form onSubmit={handleTrackOrder} className="tracking-form">
          <div className="form-group">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter Booking ID (e.g., WT-2023-001234)"
              className="tracking-input"
            />
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Tracking...' : 'Track Order'}
            </button>
          </div>
        </form>

        {bookingStatus && (
          <div className="booking-details">
            <div className="booking-summary">
              <div className="summary-item">
                <span className="label">Booking ID:</span>
                <span className="value">{bookingStatus.id}</span>
              </div>
              <div className="summary-item">
                <span className="label">Customer:</span>
                <span className="value">{bookingStatus.customerName}</span>
              </div>
              <div className="summary-item">
                <span className="label">Delivery Location:</span>
                <span className="value">{bookingStatus.location}</span>
              </div>
              <div className="summary-item">
                <span className="label">Tank Size:</span>
                <span className="value">{bookingStatus.tankSize}</span>
              </div>
              <div className="summary-item">
                <span className="label">Water Type:</span>
                <span className="value">{bookingStatus.waterType}</span>
              </div>
              <div className="summary-item">
                <span className="label">Scheduled Date:</span>
                <span className="value">{new Date(bookingStatus.scheduledDate).toLocaleDateString()}</span>
              </div>
              <div className="summary-item">
                <span className="label">Status:</span>
                <span className="value status-badge" style={{ backgroundColor: getStatusColor(bookingStatus.status) }}>
                  {bookingStatus.status.replace('-', ' ')}
                </span>
              </div>
            </div>

            <div className="status-timeline">
              <h3>Order Progress</h3>
              <div className="timeline">
                {statusTimeline.map((item, index) => (
                  <div key={item.id} className={`timeline-item ${item.completed ? 'completed' : ''} ${bookingStatus.status === item.status ? 'current' : ''}`}>
                    <div className="timeline-marker">
                      <div className="marker-inner"></div>
                    </div>
                    <div className="timeline-content">
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                      {item.date && <small>{item.date}</small>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {bookingStatus.status === 'in-transit' && (
              <div className="delivery-info">
                <h3>Delivery Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-icon">🚚</div>
                    <div>
                      <h4>Estimated Delivery</h4>
                      <p>{new Date(bookingStatus.estimatedDelivery).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-icon">👨‍💼</div>
                    <div>
                      <h4>Delivery Driver</h4>
                      <p>{bookingStatus.driverName}</p>
                      <a href={`tel:${bookingStatus.driverPhone}`} className="contact-link">
                        Call Driver
                      </a>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-icon">🚛</div>
                    <div>
                      <h4>Vehicle</h4>
                      <p>{bookingStatus.vehicleNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="action-buttons">
              <button className="btn btn-secondary">Download Receipt</button>
              <button className="btn btn-outline">Contact Support</button>
            </div>
          </div>
        )}

        {!bookingStatus && !isLoading && (
          <div className="confirmation-preview">
            <h3>Booking Confirmation Preview</h3>
            <div className="confirmation-card">
              <div className="confirmation-header">
                <h4>Thank You for Your Booking!</h4>
                <p>Your water tank delivery is confirmed</p>
              </div>
              
              <div className="confirmation-details">
                <div className="detail-row">
                  <span>Booking ID:</span>
                  <span>WT-2023-001234</span>
                </div>
                <div className="detail-row">
                  <span>Delivery Address:</span>
                  <span>Sector 45, Delhi</span>
                </div>
                <div className="detail-row">
                  <span>Tank Size:</span>
                  <span>1000 Liters</span>
                </div>
                <div className="detail-row">
                  <span>Water Type:</span>
                  <span>Mineral Water</span>
                </div>
                <div className="detail-row">
                  <span>Scheduled Date:</span>
                  <span>June 15, 2023</span>
                </div>
                <div className="detail-row">
                  <span>Time Slot:</span>
                  <span>Afternoon (12PM - 4PM)</span>
                </div>
                <div className="detail-row">
                  <span>Total Amount:</span>
                  <span>₹600</span>
                </div>
              </div>
              
              <div className="confirmation-actions">
                <button className="btn btn-primary">Track Order</button>
                <button className="btn btn-outline">Edit Booking</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;