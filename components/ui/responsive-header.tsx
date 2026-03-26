import React, { useState } from 'react';
import '../global-styles.css'; // Import global styles
import './responsive-header.css';

const ResponsiveHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="responsive-header">
      <div className="header-container container">
        <div className="logo-container">
          <a href="/" className="logo">
            WaterTank<span className="logo-highlight">Booking</span>
          </a>
        </div>

        <button 
          className="menu-toggle" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <span className={`hamburger ${isMenuOpen ? 'hamburger-active' : ''}`}>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </span>
        </button>

        <nav className={`main-nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <a href="#home" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</a>
            </li>
            <li className="nav-item">
              <a href="#services" className="nav-link" onClick={() => setIsMenuOpen(false)}>Services</a>
            </li>
            <li className="nav-item">
              <a href="#pricing" className="nav-link" onClick={() => setIsMenuOpen(false)}>Pricing</a>
            </li>
            <li className="nav-item">
              <a href="#testimonials" className="nav-link" onClick={() => setIsMenuOpen(false)}>Testimonials</a>
            </li>
            <li className="nav-item">
              <a href="#contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default ResponsiveHeader;