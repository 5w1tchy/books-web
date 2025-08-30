import { useState } from "react";
import "./NavBar.css";


function NavBar() {
  const [isOpen, setIsOpen] = useState(false); // მთლიანი მენიუს ხილვადობა

  return (
    <nav id="nav-menu-container">
      {/* მენიუს ღილაკი */}
      <div 
        className="menu-button" 
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        კატეგორიები ▼
        {isOpen && (
          <ul className="nav-menu">
            <li className="menu-active"><a href="#home">მთავარი</a></li>
            <li className="dropdown">
              <a href="/categories">კატეგორიები ▼</a>
              <ul className="dropdown-menu">
                <li><a href="#cat1">კატეგორია 1</a></li>
                <li><a href="#cat2">კატეგორია 2</a></li>
              </ul>
            </li>
            <li><a href="/books">წიგნები</a></li>
            <li><a href="#price">ფასი</a></li>
            <li><a href="#course">კურსი</a></li>
          </ul>
        )}
       
  
      </div>
      </nav>
  );
}



export default NavBar;
