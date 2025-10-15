import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Books from "./pages/Books";
import About from "./pages/about";
import BookDetails from "./pages/bookdetails";
import ForYou from "./pages/ForYou";
import Intro from "./components/Intro/Intro";
import Banner from "./components/Banner/banner";
import AudioShorts from "./components/AudioShorts/AudioShorts";
import CircularLayout from "./components/CircularLayout/CircularLayout";
import Contact from "./pages/Contact";
import Faq from "./components/Faq/Faq";

import { AuthProvider } from "./context/AuthContext";

// --- ადმინის კომპონენტები ---
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import "./App.css";

// Layout კომპონენტი Header/Footer-ის კონტროლისთვის
function Layout({ children, searchTerm, onSearch }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="app-container">
      {!isAdminRoute && <Header onSearch={onSearch} />}
      <main className={isAdminRoute ? "admin-main-content" : "main-content"}>
        {children}
      </main>
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
            {/* მთავარი გვერდი */}
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

            {/* საჯარო გვერდები */}
            <Route path="/books" element={<Books searchTerm={searchTerm} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/login" element={<Navigate to="/admin/login" replace />} />

            {/* დაცული გვერდები (User) */}
            <Route
              path="/for-you"
              element={
                <ProtectedRoute>
                  <ForYou />
                </ProtectedRoute>
              }
            />
            <Route
              path="/books/:slug"
              element={
                <ProtectedRoute>
                  <BookDetails />
                </ProtectedRoute>
              }
            />

            {/* დაცული გვერდები (Admin) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/old"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Admin />
                </ProtectedRoute>
              }
            />

            {/* 404 fallback */}
            <Route
              path="*"
              element={
                <div style={{ textAlign: "center", padding: "50px" }}>
                  <h2>404 - გვერდი ვერ მოიძებნა</h2>
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
