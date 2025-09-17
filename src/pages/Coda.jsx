// src/components/Coda.jsx

import React from 'react';
import './Coda.css'; // სტილების ფაილს შემდეგ ეტაპზე შევქმნით

function Coda({ text }) {
  // თუ text არ არსებობს ან ცარიელია, კომპონენტი არაფერს დახატავს
  if (!text) {
    return null;
  }

  return (
    <div className="coda-container">
      <p className="coda-text">"{text}"</p>
    </div>
  );
}

export default Coda;