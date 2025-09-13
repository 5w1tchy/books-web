import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Books from './pages/Books';
import About from './pages/about';
import BookDetails from './pages/bookdetails'; // <-- 1. დამატებული იმპორტი
import ForYou from './pages/ForYou';
import Intro from './components/Intro/Intro';
import Banner from './components/Banner/banner';
import AudioShorts from './components/AudioShorts/AudioShorts';
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
                  <AudioShorts />
                </>
              }
            />

            <Route path="/books" element={<Books searchTerm={searchTerm} />} />
            <Route path="/about" element={<About />} />
            <Route path="/for-you" element={<ForYou />} />
            
            {/* ეს ხაზი ახლა გამართულად იმუშავებს */}
            <Route path="/books/:slug" element={<BookDetails />} />

          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;

