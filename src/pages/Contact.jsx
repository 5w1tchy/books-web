import React from 'react';
import './Contact.css';

// SVG იკონკები უკეთესი ხარისხისა და მართვისთვის
const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);

function Contact() {
  // ეს მონაცემები შეგიძლიათ შეცვალოთ თქვენი რეალური ინფორმაციით
  const officeAddress = "რუსთაველის გამზირი 12, თბილისი";
  const phoneNumber = "+995 32 2 123 456";
  const emailAddress = "contact@chadigital.ge";
  
  // Google Maps-ის ჩასაშენებელი ბმული
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2978.82565649987!2d44.7963253154368!3d41.70282497923616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40440cde4277a291%3A0x2a3e3b1f7a0be34!2sRustaveli%20Ave%2C%20T'bilisi!5e0!3m2!1sen!2sge!4v1664273891409!5m2!1sen!2sge";

  return (
    <div className="contact-page">
      <h1 className="contact-title">დაგვიკავშირდით</h1>
      <p className="contact-subtitle">ჩვენ ყოველთვის მზად ვართ გიპასუხოთ</p>

      <div className="contact-info-container">
        
        {/* მარცხენა: ტელეფონი */}
        <div className="icon-wrapper phone-wrapper">
          <div className="icon-circle">
            <PhoneIcon />
          </div>
          <div className="info-box">
            <span>{phoneNumber}</span>
          </div>
        </div>

        {/* მარჯვენა: ლოკაცია */}
        <div className="icon-wrapper location-wrapper">
          <div className="icon-circle">
            <LocationIcon />
          </div>
          <div className="info-box">
            <span>{officeAddress}</span>
          </div>
        </div>
        
        {/* ქვედა: იმეილი */}
        <a href={`mailto:${emailAddress}`} className="icon-wrapper email-wrapper">
          <div className="icon-circle">
            <EmailIcon />
          </div>
          <div className="info-box">
            <span>{emailAddress}</span>
          </div>
        </a>

      </div>

      <div className="map-container">
        <iframe
          src={mapEmbedUrl}
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="ჩვენი ოფისის მდებარეობა"
        ></iframe>
      </div>
    </div>
  );
}

export default Contact;
