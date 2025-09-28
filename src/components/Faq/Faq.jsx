import React, { useState } from 'react';
import './Faq.css';

// დამხმარე კომპონენტი ერთი კითხვა-პასუხისთვის
const FaqItem = ({ question, answer, index, activeIndex, setActiveIndex }) => {
  const isActive = index === activeIndex;

  const toggleAccordion = () => {
    // თუ დაჭერილი კითხვა უკვე აქტიურია, ვხურავთ, სხვა შემთხვევაში ვხსნით
    setActiveIndex(isActive ? null : index);
  };

  return (
    <div className="faq-item">
      <button className={`faq-question ${isActive ? 'active' : ''}`} onClick={toggleAccordion}>
        {question}
        <span className="faq-icon">{isActive ? '−' : '+'}</span>
      </button>
      <div className={`faq-answer ${isActive ? 'open' : ''}`}>
        <div className="faq-answer-content">
          {answer}
        </div>
      </div>
    </div>
  );
};

// მთავარი FAQ კომპონენტი
const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: 'რა შეუძლია ჩვენს საიტს?',
      answer: 'ჩვენი საიტი გთავაზობთ წიგნების უნიკალურ აუდიო-შორთებს, ავტორიზაციას პერსონალური გამოცდილებისთვის, რეკომენდაციებს და მუდმივად მზარდ კატალოგს.',
    },
    {
      question: 'როგორ შემიძლია გამოვიყენო აპლიკაცია?',
      answer: 'უბრალოდ დარეგისტრირდით, აირჩიეთ თქვენთვის საინტერესო წიგნი და დაიწყეთ მოსმენა. "შენთვის" გვერდზე კი იპოვით პერსონალურ რეკომენდაციებს.',
    },
    {
      question: 'რამდენი წიგნის შორთია საიტზე და რა ჟანრებია?',
      answer: 'ჩვენს კატალოგში ამჟამად 200-ზე მეტი შორთია და ის მუდმივად იზრდება. ჟანრები მოიცავს კლასიკას, ფანტასტიკას, დეტექტივს, რომანტიკას და თვითგანვითარებას.',
    },
    {
      question: 'რა ხდის ჩვენს შორთებს მომხიბვლელად?',
      answer: 'ჩვენი შორთები პროფესიონალი მსახიობების მიერაა გახმოვანებული, მაღალი ხარისხის აუდიო-ეფექტებით. ისინი შექმნილია იმისთვის, რომ 10-15 წუთში მოგიყვეთ წიგნის მთავარი ისტორია და ემოცია.',
    },
  ];

  return (
    <section className="faq-section">
      <h2>ხშირად დასმული კითხვები</h2>
      <div className="faq-container">
        {faqData.map((item, index) => (
          <FaqItem
            key={index}
            question={item.question}
            answer={item.answer}
            index={index}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        ))}
      </div>
      <p className="faq-support-text">
        თუ კიდევ გაქვთ რაიმე კითხვები, შეგიძლიათ დაუკავშირდეთ ჩვენს <a href="/contact">მხარდაჭერის გუნდს</a>.
      </p>
    </section>
  );
};

export default Faq;
