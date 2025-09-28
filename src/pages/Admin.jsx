import React from 'react';
import './Admin.css';

const Admin = () => {
  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>ადმინის პანელი</h1>
        <p>მოგესალმებით, აქედან შეგიძლიათ საიტის მართვა.</p>
      </header>

      <div className="admin-dashboard">
        <div className="dashboard-card">
          <h3>მომხმარებლები</h3>
          <p>მომხმარებლების სიის ნახვა და მართვა.</p>
          <button className="admin-button">მართვა</button>
        </div>
        <div className="dashboard-card">
          <h3>წიგნები</h3>
          <p>ახალი წიგნის დამატება ან არსებულის რედაქტირება.</p>
          <button className="admin-button">ახლის დამატება</button>
        </div>
        <div className="dashboard-card">
          <h3>ანალიტიკა</h3>
          <p>საიტის სტატისტიკის ნახვა.</p>
          <button className="admin-button">ნახვა</button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
