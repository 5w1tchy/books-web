import React, { useState } from "react";
import "./banner.css"; // CSS ფაილის იმპორტი

// მონაცემები ბანერებისთვის
const bannersData = [
  {
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    title: "ფანტასტიკა"
  },
  {
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3",
    title: "კლასიკა"
  },
  {
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
    title: "რომანები"
  }
];

function Banner() {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const handleMouseEnter = (index) => {
    setExpandedIndex(index);
  };

  return (
    <div className="banner-container">
      {bannersData.map((banner, index) => (
        <div
          key={index}
          className={`banner ${index === expandedIndex ? 'expanded' : ''}`}
          onMouseEnter={() => handleMouseEnter(index)}
          style={{ backgroundImage: `url(${banner.image})` }}
        >
          <h3>{banner.title}</h3>
        </div>
      ))}
    </div>
  );
}

export default Banner;
