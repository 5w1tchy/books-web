import { useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";

import AudioShorts from "./components/AudioShorts/AudioShorts";
import Banner from "./components/Banner/banner";
import CircularLayout from "./components/CircularLayout/CircularLayout";
import Faq from "./components/Faq/Faq";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Intro from "./components/Intro/Intro";
import About from "./pages/about";
import BookDetails from "./pages/bookdetails";
import Books from "./pages/Books";
import Contact from "./pages/Contact";
import ForYou from "./pages/ForYou";
import Profile from "./pages/Profile";

import { AuthProvider } from "./context/AuthContext";

// --- ადმინის კომპონენტები ---
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";

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
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
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
