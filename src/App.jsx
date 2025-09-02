import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// კომპონენტები
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import BookDetails from './pages/bookdetails';
import Books from './pages/Books';
import About from './pages/about';
import Banner from './components/Banner/banner';
import Intro from './components/Intro/Intro';
import AudioShorts from './components/AudioShorts/AudioShorts';

import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />

        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={
                <>
                  <div className="home-layout">
                    <div className="home-intro-container">
                      <Intro />
                    </div>
                    <div className="home-banner-container">
                      <Banner />
                    </div>
                  </div>
                  <AudioShorts />
                </>
              } 
            />
            
            <Route path="/books" element={<Books />} />
            <Route path="/about" element={<About />} />
            <Route path="/books/:id" element={<BookDetails />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;

