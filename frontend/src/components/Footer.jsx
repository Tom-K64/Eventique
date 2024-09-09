import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
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
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/my-events">Events</Link></li>
              <li><Link to="/my-bookings">Bookings</Link></li>
            </ul>
          </div>
          {/* Segment 3: Newsletter Signup */}
          <div className="col-md-3">
            <h5>Sign Up for Updates</h5>
            <form>
              <div className="mb-3">
                <input type="email" className="form-control" placeholder="Enter email" />
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
