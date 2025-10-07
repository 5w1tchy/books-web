import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

// --- ადმინის კომპონენტების იმპორტი ---
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard'; // ახალი დაშბორდი
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

import './App.css';

// Layout კომპონენტი Header და Footer-ის კონტროლისთვის
function Layout({ children, searchTerm, onSearch }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app-container">
      {/* Header მხოლოდ არა-ადმინის გვერდებზე */}
      {!isAdminRoute && <Header onSearch={onSearch} />}

      <main className={isAdminRoute ? "admin-main-content" : "main-content"}>
        {children}
      </main>

      {/* Footer მხოლოდ არა-ადმინის გვერდებზე */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <AuthProvider>
      <Router>
        <Layout searchTerm={searchTerm} onSearch={setSearchTerm}>
          <Routes>
            {/* --- მთავარი გვერდი --- */}
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

            {/* --- ძირითადი გვერდები --- */}
            <Route path="/books" element={<Books searchTerm={searchTerm} />} />
            <Route path="/about" element={<About />} />
            <Route path="/for-you" element={<ForYou />} />
            <Route path="/books/:slug" element={<BookDetails />} />
            <Route path="/contact" element={<Contact />} />

            {/* --- ადმინის როუტები --- */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* ძველი Admin კომპონენტი - თუ არსებობს */}
            <Route
              path="/admin/old"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Admin />
                </ProtectedRoute>
              }
            />
            
            {/* ახალი AdminDashboard - მთავარი ადმინის პანელი */}
            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            {/* --- 404 გვერდი (ოპციონალური) --- */}
            <Route 
              path="*" 
              element={
                <div style={{ textAlign: 'center', padding: '50px' }}>
                  <h2>გვერდი ვერ მოიძებნა</h2>
                  <p>404 - Page Not Found</p>
                  <a href="/">მთავარ გვერდზე დაბრუნება</a>
                </div>
              } 
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;