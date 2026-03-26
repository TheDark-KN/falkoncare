import React from 'react';

const MetaTags = () => {
  return (
    <>
      {/* Standard Meta Tags */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#1e40af" />
      
      {/* Primary Meta Tags */}
      <title>WaterTank Booking - Reliable Water Delivery Service</title>
      <meta name="title" content="WaterTank Booking - Reliable Water Delivery Service" />
      <meta 
        name="description" 
        content="Book clean, reliable water tank delivery services online. Fast delivery, transparent pricing, and quality guaranteed. Serving multiple cities across the region." 
      />
      <meta 
        name="keywords" 
        content="water delivery, water tank booking, clean water, water delivery service, water supply, water delivery near me" 
      />
      <meta name="author" content="WaterTank Booking" />
      <meta name="robots" content="index, follow" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.watertankbooking.com/" />
      <meta property="og:title" content="WaterTank Booking - Reliable Water Delivery Service" />
      <meta 
        property="og:description" 
        content="Book clean, reliable water tank delivery services online. Fast delivery, transparent pricing, and quality guaranteed." 
      />
      <meta property="og:image" content="https://www.watertankbooking.com/images/water-delivery-og.jpg" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://www.watertankbooking.com/" />
      <meta property="twitter:title" content="WaterTank Booking - Reliable Water Delivery Service" />
      <meta 
        property="twitter:description" 
        content="Book clean, reliable water tank delivery services online. Fast delivery, transparent pricing, and quality guaranteed." 
      />
      <meta property="twitter:image" content="https://www.watertankbooking.com/images/water-delivery-twitter.jpg" />
      
      {/* Canonical URL */}
      <link rel="canonical" href="https://www.watertankbooking.com/" />
      
      {/* Performance Optimizations */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link 
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
        rel="stylesheet" 
      />
      
      {/* Preload critical resources */}
      <link rel="preload" href="/water-tank-delivery.jpg" as="image" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "WaterTank Booking",
          "image": "https://www.watertankbooking.com/images/logo.png",
          "telephone": "+91-9876543210",
          "email": "info@watertankbooking.com",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "123 Water Avenue, Sector 45",
            "addressLocality": "New Delhi",
            "postalCode": "110045",
            "addressCountry": "IN"
          },
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "06:00",
              "closes": "22:00"
            },
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Saturday", "Sunday"],
              "opens": "07:00",
              "closes": "21:00"
            }
          ],
          "priceRange": "$$",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "1200"
          }
        })}
      </script>
    </>
  );
};

export default MetaTags;