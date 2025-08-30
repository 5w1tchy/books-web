import React, { useState, useEffect } from "react";
// იმპორტი CSS ფაილის, რომელიც სტილებს შეიცავს
import "./Banner.css";

// სურათების მისამართები. დარწმუნდით, რომ ეს ფაილები არსებობს `public/images` პაპკაში
const images = [
  "/images/banner1.jpg",
  "/images/banner2.jpg",
  "/images/banner3.jpg"
];

function Banner() {
  // useState Hook-ი, რომელიც ინახავს მიმდინარე სურათის ინდექსს (ნომერს)
  const [index, setIndex] = useState(0);

  // useEffect Hook-ი სლაიდერის ლოგიკისთვის
  useEffect(() => {
    // იქმნება ტაიმერი, რომელიც ყოველ 3 წამში ცვლის სურათს
    const timer = setInterval(() => {
      // setIndex ფუნქცია ცვლის state-ს. 
      // ვიყენებთ წინა ინდექსს, ვუმატებთ 1-ს და ვყოფთ სურათების რაოდენობაზე ნაშთით,
      // რათა ციკლი არ შეწყდეს და ბოლო სურათის შემდეგ პირველზე გადავიდეს.
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // სურათი იცვლება 3000 მილიწამში (3 წამში) ერთხელ

    // ეს ფუნქცია ეშვება მაშინ, როდესაც კომპონენტი "ქრება" ეკრანიდან.
    // ის შლის ტაიმერს, რათა თავიდან ავიცილოთ მეხსიერების გაჟონვა.
    return () => clearInterval(timer);
  }, []); // ცარიელი მასივი [] ნიშნავს, რომ ეს ეფექტი მხოლოდ ერთხელ გაეშვება, კომპონენტის პირველი დახატვისას.

  return (
    <div className="banner-container">
      {/* სურათის src ატრიბუტში ვიყენებთ მიმდინარე ინდექსს images მასივიდან სურათის ამოსაღებად */}
      <img src={images[index]} alt="ბანერი" className="banner-image" />
    </div>
  );
}

export default Banner;

