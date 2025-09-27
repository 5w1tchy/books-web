import React, { useState, useEffect } from 'react';
import './Mascot.css';

const Mascot = () => {
  // State, რომელიც ინახავს ბიჯუნას პოზიციას და დახრის კუთხეს
  const [position, setPosition] = useState({ top: 80, left: 90 });
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    // ფუნქცია, რომელიც არჩევს ახალ, შემთხვევით პოზიციას და დახრის კუთხეს
    const moveMascot = () => {
      // ახალი კოორდინატები ეკრანის 5%-დან 90%-მდე
      const newTop = 5 + Math.random() * 85;
      const newLeft = 5 + Math.random() * 85;
      setPosition({ top: newTop, left: newLeft });

      // ახალი დახრის კუთხე -20-დან +20 გრადუსამდე
      const newRotation = -20 + Math.random() * 40;
      setRotation(newRotation);
    };

    // ვუშვებთ ინტერვალს, რომელიც ბიჯუნას ყოველ 5 წამში ამოძრავებს
    const intervalId = setInterval(moveMascot, 5000);

    // ვასუფთავებთ ინტერვალს, როცა კომპონენტი ეკრანიდან ქრება
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div 
      className="mascot-container" 
      style={{ 
        top: `${position.top}%`, 
        left: `${position.left}%`,
        transform: `rotate(${rotation}deg)` // ვამატებთ დახრის სტილს
      }}
    >
      {/* აქ ჩასვით თქვენი დიზაინერის მიერ შექმნილი სურათის მისამართი */}
      <img 
        src="https://placehold.co/100x100/3498db/ffffff?text=^_^" 
        alt="საიტის ბიჯუნა" 
        className="mascot-image"
      />
    </div>
  );
};

export default Mascot;

