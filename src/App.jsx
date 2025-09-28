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
import CircularLayout from './components/CircularLayout/CircularLayout';
import Contact from './pages/Contact';
import { AuthProvider } from './context/AuthContext';
import Faq from './components/Faq/Faq';

// --- 1. ახალი კომპონენტების იმპორტი ---
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <AuthProvider>
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
                    <CircularLayout />
                    <AudioShorts />
                    <Faq />
                  </>
                }
              />
              <Route path="/books" element={<Books searchTerm={searchTerm} />} />
              <Route path="/about" element={<About />} />
              <Route path="/for-you" element={<ForYou />} />
              <Route path="/books/:slug" element={<BookDetails />} />
              <Route path="/contact" element={<Contact />} />

              {/* --- 2. დაცული ადმინის როუტის დამატება --- */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Admin />
                  </ProtectedRoute>
                }
              />

            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

