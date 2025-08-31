import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// კომპონენტები
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import BookDetails from './pages/bookdetails';
// Home კომპონენტის იმპორტი აღარ არის აუცილებელი, თუ მას სხვაგან არ იყენებთ
// import Home from './pages/Home';
import Books from './pages/Books';
import About from './pages/about';
import './App.css';

// 1. დავამატოთ Banner კომპონენტის იმპორტი
// დარწმუნდით, რომ მისამართი სწორია
import Banner from './components/Banner/banner';

function App() {
  // აქ ვქმნით state-ს search-სთვის
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Router>
      <div className="app-container">
        {/* Header-ს ვაწვდით search callback */}
        <Header onSearch={setSearchTerm} />

        <main className="main-content">
          <Routes>
            {/* 2. შევცვალოთ Home კომპონენტი პირდაპირი JSX კოდით */}
            <Route 
              path="/" 
              element={
                // ვიყენებთ React.Fragment-ს <>-ს, რომ რამდენიმე ელემენტი დავაბრუნოთ
                <>
                  <h1 className="section-title">ახალი წიგნები</h1>
                  <Banner />
                </>
              } 
            />
            
            {/* Books-ს ვაწვდით searchTerm */}
            <Route path="/books" element={<Books searchTerm={searchTerm} />} />
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