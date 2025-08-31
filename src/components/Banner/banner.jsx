import React, { useState } from "react";
// იმპორტი CSS ფაილის
import "./Banner.css";

// მონაცემები ბანერებისთვის: სურათები და სათაურები
const bannersData = [
  {
    image: "/images/banner1.jpg",
    title: "მოგზაურობა"
  },
  {
    image: "/images/banner2.jpg",
    title: "ტექნოლოგია"
  },
  {
    image: "/images/banner3.jpg",
    title: "ბუნება"
  }
];

function Banner() {
  // useState Hook-ი, რომელიც ინახავს ამჟამად გაფართოებული ბანერის ინდექსს.
  // თავდაპირველად პირველი ბანერი (ინდექსი 0) იქნება გაფართოებული.
  const [expandedIndex, setExpandedIndex] = useState(0);

  // ფუნქცია, რომელიც გამოიძახება მაუსის მიტანისას და ცვლის აქტიურ ინდექსს
  const handleMouseEnter = (index) => {
    setExpandedIndex(index);
  };

  return (
    <div className="banner-container">
      {/* bannersData მასივზე გადავუვლით map ფუნქციით, რომ თითოეული ელემენტისთვის დავხატოთ ბანერი */}
      {bannersData.map((banner, index) => (
        <div
          // key აუცილებელია React-ისთვის, როდესაც ელემენტებს ვხატავთ სიიდან
          key={index}
          
          // className-ს ვანიჭებთ დინამიურად:
          // 'banner' კლასი ყველას ექნება.
          // 'expanded' კლასი დაემატება მხოლოდ იმ შემთხვევაში, თუ ამ ელემენტის ინდექსი ემთხვევა expandedIndex-ს.
          className={`banner ${index === expandedIndex ? 'expanded' : ''}`}
          
          // მაუსის მიტანისას ვიძახებთ handleMouseEnter ფუნქციას და გადავცემთ მიმდინარე ინდექსს
          onMouseEnter={() => handleMouseEnter(index)}
          
          // ფონის სურათს ვანიჭებთ inline style-ით
          style={{ backgroundImage: `url(${banner.image})` }}
        >
          <h3>{banner.title}</h3>
        </div>
      ))}
    </div>
  );
}

export default Banner;