import React, { useState } from 'react';
import './AudioShorts.css';

// დროებითი მონაცემები. რეალურ აპლიკაციაში ეს მონაცემები API-დან წამოვა.
const shortsData = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `წიგნის სათაური ${i + 1}`,
  author: `ავტორი ${i + 1}`,
  coverUrl: `https://placehold.co/280x200/5DADE2/ffffff?text=Book${i + 1}`,
  audioUrl: 'path/to/your/audio.mp3'
}));

// ეს ცვლადი განსაზღვრავს, რამდენი ელემენტი არ უნდა დარჩეს ეკრანს მიღმა,
// რომ "შემდეგი" ღილაკი გაითიშოს. დესკტოპისთვის 4 ოპტიმალურია.
const ITEMS_PER_PAGE = 4;

function AudioShorts() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    // ვამოწმებთ, რომ პირველ სლაიდზე უფრო უკან არ გადავიდეთ
    const isFirstSlide = currentIndex === 0;
    if (!isFirstSlide) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    // ვამოწმებთ, რომ ბოლო სლაიდების ჯგუფს არ გავცდეთ
    const isLastGroup = currentIndex >= shortsData.length - ITEMS_PER_PAGE;
    if (!isLastGroup) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // ობიექტი, რომელიც დინამიურად ცვლის სტილს და ამოძრავებს კონტეინერს
  const sliderStyle = {
    transform: `translateX(-${currentIndex * (280 + 30)}px)` // 280px (სიგანე) + 30px (დაშორება)
  };

  return (
    <section className="shorts-section">
      <h2 className="section-title">ბოლოს დამატებული აუდიო შორთები</h2>
      <div className="shorts-slider">
        <button 
          onClick={goToPrevious} 
          className="slider-arrow left-arrow" 
          disabled={currentIndex === 0}
        >
          &#10094;
        </button>

        <div className="shorts-slider-wrapper">
          <div className="shorts-container" style={sliderStyle}>
            {shortsData.map(short => (
              <article key={short.id} className="short-item">
                <img src={short.coverUrl} alt={short.title} className="short-cover" />
                <div className="short-info">
                  <h3 className="short-title">{short.title}</h3>
                  <p className="short-author">{short.author}</p>
                  <audio controls className="short-player">
                    <source src={short.audioUrl} type="audio/mpeg" />
                    თქვენი ბრაუზერი არ უჭერს მხარს აუდიო ელემენტს.
                  </audio>
                </div>
              </article>
            ))}
          </div>
        </div>
        
        <button 
          onClick={goToNext} 
          className="slider-arrow right-arrow"
          disabled={currentIndex >= shortsData.length - ITEMS_PER_PAGE}
        >
          &#10095;
        </button>
      </div>
    </section>
  );
}

export default AudioShorts;

