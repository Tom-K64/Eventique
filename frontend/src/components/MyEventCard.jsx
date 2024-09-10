import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MyEventCard = ({ event,change,setChange }) => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
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
    const handlePrivacyUpdate = async() => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BASE_URL}/events/website/api/event-privacy-update-api/${event.id}/`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`,
                        "Content-Type": "application/json",
                    },
                    // body: JSON.stringify({ }),
                }
            );
            const data = await response.json();
            if (response.ok) {
                newAlert("Privacy status Changed successfully !    x", "success");
                setChange(!change);
            } else {
                newAlert(`${data?.message}   x`, "danger");
            }
        } catch (e) {
            newAlert(`${e.message}`, "warning");
        }
    }

    const handleUpdate = () =>{
        if(event.capacity!=event.available){
            newAlert("Some Tickets have been booked, Contact Admin to Update !!!","warning");
        }else{
            navigate(`/update-event/${event.id}`);
        }
    }
    return (
        <div className="card mb-3">
            {showAlert && (
                <div
                    className={`alert alert-${alertType} position-fixed`}
                    style={{ top: "100px", right: "20px", width: "auto", zIndex: "100" }}
                    role="alert"
                >
                    {alertMessage}
                </div>
            )}
            <div className="row no-gutters">
                {/* Left side with poster */}
                <div className="col-md-3">
                    <img src={event?.poster ? `${import.meta.env.VITE_BASE_URL}${event.poster}`:"https://via.placeholder.com/150"} className="card-img p-3" style={{ borderRadius: "10%", maxHeight: "200px" }} alt="Event Poster" />
                </div>

                {/* Right side with event details */}
                <div className="col-md-1"></div>
                <div className="col-md-4">
                    <div className="card-body">
                        <h5 className="card-title">{event.title}</h5>
                        <p className="card-text mb-0">Category : {event.category.title}</p>
                        <p className="card-text mb-0">Venue&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : {event.venue}</p>
                        <p className="card-text mb-0">Location&nbsp; : {event.location}</p>
                        <p className="card-text mb-0">Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : {formatDate(event.start_date)}</p>
                        <p className="card-text mb-0">Time&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : {formatTime(event.start_time)}</p>
                    </div>
                </div>
                <div className="col-md-3 ">
                    <div className="card-body">
                        <p className="card-text mt-4 mb-0">Privacy&nbsp;&nbsp;&nbsp; : {event.is_private ? "Private":"Public"}</p>
                        <p className="card-text mb-0">Capacity&nbsp; : {event.capacity}</p>
                        <p className="card-text mb-4">Available&nbsp; : {event.available}</p>
                        <button className=" btn  btn-outline-primary" onClick={()=>navigate(`/event/${event.id}`)} >Go to Organiser Controls</button>
                    </div>
                </div>
                {/* Three-dot overflow menu */}
                <div className="col-md-1 d-flex justify-content-center">
                    <div className="dropdown mt-3">
                    <b><i
                            className="btn fa fa-ellipsis-v"
                            aria-hidden="true"
                            onClick={toggleMenu}
                        ></i></b>

                        {menuOpen && (
                            <div className="dropdown-menu show">
                                <button className="dropdown-item" onClick={handlePrivacyUpdate}>
                                    Make {event.is_private ? "Public":"Private"}
                                </button>
                                <button className="dropdown-item" onClick={handleUpdate}>
                                    Update Event
                                </button>
                                <button className="dropdown-item text-danger">
                                    Delete Event
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyEventCard;