import React, { useEffect, useState } from 'react';
import EventCard from '../components/EventCard';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const eventTypes = [
    { icon: 'fas fa-music', label: 'Music' },
    { icon: 'fas fa-paint-brush', label: 'Art' },
    { icon: 'fas fa-theater-masks', label: 'Theatre' },
    { icon: 'fas fa-gamepad', label: 'Gaming' },
    { icon: 'fas fa-film', label: 'Movies' },
  ];

  const [events,setEvents] = useState([]);

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

  const getEvents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/events/website/api/event-list-api/`);
      const data = await response.json();
      if (response.ok) {
        setEvents([...data.results]);
      } else {
        newAlert(data.message, "danger");
      }
    } catch (err) {
      newAlert(err.message, "danger");
    }
  };

  useEffect(() => {
    getEvents();
  }, []);
  return (
    <div className='mt-4'>
      {showAlert && (
        <div
          className={`alert alert-${alertType} position-fixed`}
          style={{ top: "100px", right: "20px", width: "auto", zIndex: "100" }}
          role="alert"
        >
          {alertMessage}
        </div>
      )}
      <div className="container">
        {/* <h3 className='mb-3'>Categories</h3>
        <div className="d-flex justify-content-evenly my-4">
          {eventTypes.map((type, index) => (
            <div key={index} className="text-center">
              <i className={`${type.icon} fa-3x mb-2`}></i>
              <p>{type.label}</p>
            </div>
          ))}
        </div> */}
        <h3 className='mb-3'>Latest Events</h3>
        <div className="row">
          {events.map((event) => (
            <div className="col-md-3" key={event.id} onClick={(e)=> navigate(`/event/${event.id}`)}>
            <EventCard data={event}/>
          </div>
          ))}
          
        </div>
      </div>
      <div className="container text-center">
        <button className='btn btn-outline-success' onClick={()=>navigate("/events")}>See all Events</button>
      </div>
    </div>
  );
};

export default HomePage;
