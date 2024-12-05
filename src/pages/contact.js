import "../app/globals.css";
import "../css/contactform.css";
import Navbar from "../components/navbar";
import Socialsbar from "../components/socialsbar";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
    const { name, email, message } = formData;
    const mailtoLink = `mailto:jozef@waldhauser.sk?subject=Contact%20Form%20Submission&body=Name:%20${encodeURIComponent(name)}%0AEmail:%20${encodeURIComponent(email)}%0AMessage:%20${encodeURIComponent(message)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div>
      <Navbar />
      <div className="contact-container">
        <h1 className="contact-header">Contact Me</h1>
        
        <div className="contact-info">
          <p>jozef@waldhauser.sk</p>
          <Socialsbar />
        </div>
        
        <div className="contact-form">
          <h2>Send Me a Message</h2>
          <form onSubmit={handleSubmit}>
            <label className="contact-label" htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            
            <label className="contact-label" htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            
            <label className="contact-label" htmlFor="message">Message:</label>
            <textarea id="message" name="message" rows="4" value={formData.message} onChange={handleChange} required></textarea>
            
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}