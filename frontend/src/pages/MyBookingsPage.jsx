import React, { useState, useEffect,useContext } from 'react';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';
import { loginContext } from '../App';

const MyBoookings = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(loginContext);
  const [tickets, setTickets] = useState(
    [
      {
        "event": {
          "id": 8,
          "title": "Dummy Title",
          "start_date": "2024-09-14",
          "start_time": "17:30:00",
          "venue": "Dummy Venue",
          "location": "Dummy Location",
          "category": "Dummy Category",
          "poster": null,
        },
        "total_ticket_count": 5,
        "total_price_paid": 3195
      }
    ]
  );

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

  function formatDate(dateInput) {
    const dateObj = new Date(dateInput);
    return dateObj.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
  }
  function formatTime(timeInput) {
    const [hours, minutes] = timeInput.split(':');
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  const getBookings = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/events/website/api/user-tickets-list-api/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setTickets([...data]);
      } else {
        newAlert(data.message, "danger");
      }
    } catch (err) {
      newAlert(err.message, "danger");
    };
  };
  useEffect(() => {
    if (isLoggedIn) {
      getBookings();
    } else {
      navigate("/");
    }

  }, []);
  return (
    <div className="container mt-5 mb-3">
      {showAlert && (
        <div
          className={`alert alert-${alertType} position-fixed`}
          style={{ top: "100px", right: "20px", width: "auto", zIndex: "100" }}
          role="alert"
        >
          {alertMessage}
        </div>
      )}
      {/* Event List */}
      <div className="row mb-3">
        <div className="col-md-12">
          <h3 className='mb-0'>My Bookings</h3>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-12">
          {tickets.length === 0 ? (
            <div className="text-center mt-5">
              <h3>No Bookings yet</h3>
              <button className="btn btn-outline-success mb-5" onClick={() => navigate("/events")}>Explore Events</button>
            </div>
          ) : (
            <div className="container mt-4">
              {tickets.map((ticket, index) => (
                <div className="card mb-3" key={ticket.id}>
                  <div className="row no-gutters">
                    {/* Left side with poster */}
                    <div className="col-md-3">
                      <img src={ticket.event.poster ? `${import.meta.env.VITE_BASE_URL}${ticket.event.poster}` : "https://via.placeholder.com/150"} className="card-img p-3" style={{ borderRadius: "10%", height: '200px' }} alt="Event Poster" />
                    </div>
                    <div className="col-md-3">
                      <div className="card-body">
                        <h5 className="card-title">{ticket.event.title}</h5>
                        <p className="card-text mb-0">Category : {ticket.event.category}</p>
                        <p className="card-text mb-0" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Venue&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : {ticket.event.venue}</p>
                        <p className="card-text mb-0" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Location&nbsp; : {ticket.event.location}</p>
                        <p className="card-text mb-0" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : {formatDate(ticket.event.start_date)}</p>
                        <p className="card-text mb-0" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Time&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : {formatTime(ticket.event.start_time)}</p>
                      </div>
                    </div>
                    <div className="col-md-3 ">
                      <div className="card-body">
                        <p className="card-text mt-4 mb-0">Tickets Booked&nbsp;: {ticket.total_ticket_count}</p>
                        <p className="card-text mb-0">Amount Paid&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : &#8377;{ticket.total_price_paid}</p>
                      </div>
                    </div>
                    <div className="col-md-3 d-flex justify-content-center align-items-center">
                      <QRCode value={`{event:https://eventique.com/event/${ticket.event.id},total_tickets:${ticket.total_ticket_count},total_price:${ticket.total_price_paid}}`} size={128} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBoookings;
