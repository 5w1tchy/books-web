import React from 'react';
import './CircularLayout.css';

const CircularLayout = () => {
  // ტექსტები პატარა წრეებისთვის
  const satelliteTexts = [
    'ტექსტი 1',
    'ტექსტი 2',
    'ტექსტი 3',
    'ტექსტი 4',
    'ტექსტი 5',
  ];

  // ცენტრალური წიგნის ტექსტი
  const centerText = 'მოუსმინე მარტივად და გაეცანი უახლეს წიგნებს მოკლე დროში';

  // გამოვთვალოთ წრეების რაოდენობა, რომ CSS-მა დინამიურად იმუშაოს
  const totalSatellites = satelliteTexts.length;

  return (
    // ეს სექცია უზრუნველყოფს კომპონენტის ცენტრში მოთავსებას
    <div className="circular-layout-section">
      <div className="circular-container" style={{ '--total': totalSatellites }}>
        <div className="center-circle">
          <span>{centerText}</span>
        </div>

        <div className="satellite-orbit">
          {satelliteTexts.map((text, index) => (
            <div
              className="satellite-wrapper"
              key={index}
              style={{ '--i': index }} // CSS ცვლადს ვანიჭებთ ინდექსს
            >
              <div className="satellite-circle">
                {text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CircularLayout;

