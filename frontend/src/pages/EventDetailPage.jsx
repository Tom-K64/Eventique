import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { loginContext } from '../App';

const EventDetails = () => {
    const { id } = useParams();
    const {isLoggedIn} = useContext(loginContext);
    const navigate = useNavigate();
    const [event, setEvent] = useState(
      {
        "id": 6,
        "title": "Dummy Title",
        "description": "Dummy Event Description",
        "start_date": "2024-09-12",
        "start_time": "13:30",
        "venue": "Dummy Venue",
        "location": "Dummy Location",
        "category": "Dummy Category",
        "price_range": 999,
        "poster": null,
        "capacity": 25,
        "available": 25
    }
    );
    const handleBook = ()=>{
      if (isLoggedIn){
        navigate(`/book-tickets/${event.id}`);
      }else{
        newAlert("Please Login to Book Tickets", "warning");
      }
    }

    const getEvent = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/events/website/api/event-detail-api/${id}/`);
          const data = await response.json();
          if (response.ok) {
            setEvent(data);
          } else {
            newAlert(data.message, "danger");
          }
        } catch (err) {
          newAlert(err.message, "danger");
        }
      };

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

      useEffect(() => {
        getEvent();
      }, []);

      function formatDate(dateInput) {
        const dateObj = new Date(dateInput);
        return dateObj.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short',year:'numeric'});
      }
      function formatTime(timeInput) {
        const [hours, minutes] = timeInput.split(':');
        const date = new Date();
        date.setHours(hours, minutes);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      }
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
            <div className="container ">
                <div className="row ">
                    <div className="col-md-12">
                        <div className="card mt-3 mb-2 h-50 bg-light">
                            <img className="card-img-top block" src={ event?.poster ? `${import.meta.env.VITE_BASE_URL}${event.poster}`:"https://via.placeholder.com/150"} style={{ height: '20rem' }} alt="Card image cap" />
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-10">
                                    <h5 className="card-title">{event?.title}</h5>
                                <p className="card-text mb-0">{event?.description}</p>
                                <p className="card-text"><small className="text-muted">{event?.category}</small></p>
                                    </div>
                                    <div className="col-md-2 d-flex justify-content-center align-items-center">
                                        <button type="button" disabled={Boolean(!event?.available)} className="btn btn-danger p-3 fs-5" onClick={handleBook}>{event?.available!=0?"Book Now":"Sold Out" }</button>
                                    </div>
                                </div>
                                <hr/>
                                <span className='me-4'>{Object.keys(event).length === 0?"":formatDate(event?.start_date)} at {Object.keys(event).length !== 0?formatTime(event?.start_time):""}</span><span className='me-4'><i className="fa fa-map-marker" >&nbsp;</i>{event?.venue} : {event?.location}</span> | &nbsp;&nbsp;<span>&#8377;{event?.price_range} <small>onwards</small></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EventDetails;
