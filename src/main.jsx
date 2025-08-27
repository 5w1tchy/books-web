import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
function NavBar() {
  return (
    <nav style={{ display: "flex", justifyContent: "flex-end", padding: "20px" }}>
      <ul style={{ listStyle: "none", display: "flex", gap: "20px" }}>
        <li><a href="#home">მთავარი</a></li>
        <li><a href="#about">ჩვენს შესახებ</a></li>
      </ul>
    </nav>
  );
}