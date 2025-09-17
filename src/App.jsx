import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Books from './pages/Books';
import About from './pages/about';
import BookDetails from './pages/bookdetails';
import ForYou from './pages/ForYou';
import Intro from './components/Intro/Intro';
import Banner from './components/Banner/banner';
import AudioShorts from './components/AudioShorts/AudioShorts';

// <-- 1. დაამატეთ ახალი კომპონენტის იმპორტი
import CircularLayout from './components/CircularLayout/CircularLayout';

import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Router>
      <div className="app-container">
        <Header onSearch={setSearchTerm} />

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className="home-layout">
                    <Intro />
                    <Banner />
                  </div>
                  
                  {/* <-- 2. აქ დავამატეთ ახალი კომპონენტი */}
                  <CircularLayout />

                  <AudioShorts />
                </>
              }
            />

            <Route path="/books" element={<Books searchTerm={searchTerm} />} />
            <Route path="/about" element={<About />} />
            <Route path="/for-you" element={<ForYou />} />
            
            <Route path="/books/:slug" element={<BookDetails />} />

          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
