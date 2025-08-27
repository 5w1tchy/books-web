import { useState, useEffect } from "react";
import "./Banner.css";

const images = [
  "/images/banner1.jpg",
  "/images/banner2.jpg",
  "/images/banner3.jpg"
];

function Banner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000); // 3 წამში ერთხელ იცვლება
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="banner-container">
      <img src={images[index]} alt="ბანერი" className="banner-image" />
    </div>
  );
}

export default Banner;