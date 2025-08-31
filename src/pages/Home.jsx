import React from 'react';
import Banner from '../components/Banner/banner';

function Home() {
  return (
    <>
      <Banner />
      <div style={{ padding: '20px' }}>
        <h1>მთავარი გვერდი</h1>
        <p>კეთილი იყოს თქვენი მობრძანება ჩვენს წიგნების მაღაზიაში!</p>
      </div>
    </>
  );
}

export default Home;
