import "../app/globals.css";
import "../css/contactform.css";
import Navbar from "../components/navbar";
import Socialsbar from "../components/socialsbar";
import CookieNotice from "../components/cookienotice";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, message } = formData;
    const mailtoLink = `mailto:jozef@waldhauser.sk?subject=Contact%20Form%20Submission&body=----- Contact Form Submission ----- %0A%0AName:%20${encodeURIComponent(name)}%0A%0AMessage:%0A${encodeURIComponent(message)}%0A%0A-----------------------------------`;    
    window.location.href = mailtoLink;
  };

  return (
    <div>
      <CookieNotice></CookieNotice>
      <Navbar />
      <div className="contact-container">
        <h1 className="contact-header">Contact Me</h1>
        
        <div className="contact-info">
          <p>Please feel free to contact me!</p>
          <p>jozef@waldhauser.sk</p>
          <Socialsbar />
        </div>
        
        <div className="contact-form">
          <h2>Send Me a Message</h2>
          <form onSubmit={handleSubmit}>
            <label className="contact-label" htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            
            <label className="contact-label" htmlFor="message">Message:</label>
            <textarea id="message" name="message" rows="4" value={formData.message} onChange={handleChange} required></textarea>
            
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}