import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// კომპონენტები
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import BookDetails from './pages/bookdetails';
import Home from './pages/Home';
import Books from './pages/Books';
import About from './pages/about';
import './App.css';

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
            <Route path="/" element={<Home />} />
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
