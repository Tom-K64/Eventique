import React,{useState} from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email,setEmail] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    newAlert("Successfully Subscribed to NewsLetter","success");
  }
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const newAlert = (msg, type) => {
    setAlertType(type);
    setAlertMessage(msg);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };
  return (
    <>
    {showAlert && (
        <div
          className={`alert alert-${alertType} position-fixed`}
          style={{ top: "100px", right: "20px", width: "auto", zIndex: "100" }}
          role="alert"
        >
          {alertMessage}
        </div>
      )}
    <footer className="bg-light py-4 mt-4">
      <div className="container">
        <div className="row">
          {/* Segment 1: Logo and Description */}
          <div className="col-md-4">
            <h5>Eventique</h5>
            <p>Streamlining event management and discovery for organizers and attendees.</p>
          </div>
          <div className="col-md-1"></div>
          {/* Segment 2: Quick Links */}
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/profile">My Profile</Link></li>
              <li><Link to="/my-events">My Events</Link></li>
              <li><Link to="/my-bookings">My Bookings</Link></li>
            </ul>
          </div>
          {/* Segment 3: Newsletter Signup */}
          <div className="col-md-3">
            <h5>Sign Up for Updates</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input type="email" className="form-control" placeholder="Enter email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
              </div>
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
    </footer>
    <div className="text-center py-3" style={{ backgroundColor: "#f8f9fa" }}>
        Developed by <a href="https://www.linkedin.com/in/tom-k64/" target="_blank" rel="noopener noreferrer">Kanhaya Kataruka</a>
    </div>
    </>
  );
};

export default Footer;
