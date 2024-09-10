import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const [eventDetails, setEventDetails] = useState({
    title: 'Sample Event Title',
    category: 'Sample Category',
    venue: 'Sample Venue',
    location: 'Sample Location',
    start_date: '2024-09-10',
    start_time: '18:00',
  });
  const [ticketTypes, setTicketTypes] = useState([
    { id: 10, title: "Basic", description: "Balcony", price: "499.00", quantity: 10 },
  ]);

  const [selectedTickets, setSelectedTickets] = useState(
    ticketTypes.map((ticket) => ({ ...ticket, selectedQuantity: 0 }))
  );

  const increment = (id) => {
    setSelectedTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id
          ? { ...ticket, selectedQuantity: Math.min(ticket.selectedQuantity + 1, ticket.quantity) }
          : ticket
      )
    );
  };

  const decrement = (id) => {
    setSelectedTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id
          ? { ...ticket, selectedQuantity: Math.max(ticket.selectedQuantity - 1, 0) }
          : ticket
      )
    );
  };

  const handleProceed = () => {
    const selected = selectedTickets
      .filter((ticket) => ticket.selectedQuantity > 0)
      .map(({ id, selectedQuantity }) => ({ id, quantity: selectedQuantity }));
    if(selected.length > 0) {
      handleCheckout(selected);
    }else{
      newAlert("Please select at least one ticket", "warning");
    }
  };

  const calculateTotalAmount = () => {
    return selectedTickets.reduce(
      (total, ticket) => total + ticket.selectedQuantity * parseFloat(ticket.price),
      0
    );
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

  const handleCheckout = async (tickets) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/events/website/api/event-ticket-checkout-api/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify({ event:id,tickets:tickets }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        newAlert("Tickets Booked successful", "success");
        setTimeout(() => {
          navigate(`/my-bookings`);
        }, 1000);
      } else {
        newAlert(data.message, "danger");
      }
    } catch (err) {
      newAlert(err.message, "danger");
    };

  };
  const getEventDetail = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/events/website/api/user-event-detail-api/${id}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setEventDetails({
          title: data.title,
          category: data.category.title,
          venue: data.venue,
          location: data.location,
          start_date: data.start_date,
          start_time: data.start_time,
          is_private: data.is_private,
        });
        setTicketTypes([...data.ticket_types]);
        setSelectedTickets(data.ticket_types.map((ticket) => ({ ...ticket, selectedQuantity: 0 })));
      } else {
        newAlert(data.message, "danger");
      }
    } catch (err) {
      newAlert(err.message, "danger");
    };
  };
  useEffect(() => {
    getEventDetail();
  }, []);

  return (
    <div className="container mt-4">
      {showAlert && (
        <div
          className={`alert alert-${alertType} position-fixed`}
          style={{ top: "100px", right: "20px", width: "auto", zIndex: "100" }}
          role="alert"
        >
          {alertMessage}
        </div>
      )}
      <div className="row">
        {/* Ticket Selection */}
        <div className="col-md-6">
          <h2>Select Tickets</h2>
          {selectedTickets.map((ticket) => (
            <div key={ticket.id} className="card mb-3 p-3">
              <div className="row">
                <div className="col-md-8">
                  <h5>{ticket.title}</h5>
                  <p>{ticket.description}</p>
                  <p>
                    Rs.{ticket.price} |{" "}
                    <span className="text-danger">Available: {ticket.quantity}</span>
                  </p>
                </div>
                <div className="col-md-4 text-end">
                  {ticket.selectedQuantity > 0 ? (
                    <div className="d-flex align-items-center justify-content-end">
                      <button
                        className="btn btn-danger me-2"
                        onClick={() => decrement(ticket.id)}
                      >
                        -
                      </button>
                      <span className="me-2 fs-4 ">
                        {ticket.selectedQuantity}
                      </span>
                      <button
                        className="btn btn-danger"
                        onClick={() => increment(ticket.id)}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => increment(ticket.id)}
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Summary */}
        <div className="col-md-6 mt-5">
          <div className="card p-3">
            <div className="card-body px-0">
              <h5 className="card-text mb-2">{eventDetails.title}</h5>
              <p className="card-text mb-0">{formatDate(eventDetails.start_date)}</p>
              <p className="card-text mb-1">{formatTime(eventDetails.start_time)}</p>
              <p className="card-text mb-0">{eventDetails.venue}</p>
              <p className="card-text mb-0">{eventDetails.location}</p>
              <hr></hr>
              <h5>Checkout Summary</h5>
            </div>
            {selectedTickets.filter(ticket => ticket.selectedQuantity > 0).map(ticket => (
              <div key={ticket.id} className="d-flex justify-content-between mb-2">
                <div>
                  <h5>{ticket.title}</h5>
                  <p>Rs.{ticket.price} | Quantity: {ticket.selectedQuantity}</p>
                </div>
                <div>
                  <h6>Rs.{(ticket.selectedQuantity * parseFloat(ticket.price)).toFixed(2)}</h6>
                </div>
              </div>
            ))}
            <hr />
            <div className="d-flex justify-content-between mt-3">
              <h5>Total Amount</h5>
              <h5>Rs. {calculateTotalAmount().toFixed(2)}</h5>
            </div>
            <button
              className="btn btn-danger w-100 mt-4"
              onClick={handleProceed}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
