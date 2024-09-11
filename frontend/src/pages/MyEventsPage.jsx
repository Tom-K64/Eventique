import React, { useState, useEffect, useContext } from 'react';
import MyEventCard from '../components/MyEventCard';
import { loginContext } from '../App';
import { useNavigate } from 'react-router-dom';

const MyEvents = () => {
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn } = useContext(loginContext);
    const [change, setChange] = useState(true);
    const [events, setEvents] = useState([]);
    const [dashboard, setDashboard] = useState({
        total_events: 0,
        upcoming_events: 0,
        total_tickets: 0,
        tickets_sold: 0
    })

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
        if (isLoggedIn) {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BASE_URL}/events/website/api/user-event-list-api/`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("access")}`,
                        },
                    }
                );
                const data = await response.json();
                if (response.ok) {
                    setEvents([...data.results]);
                    const dash = {
                        total_events: data.results.length,
                        upcoming_events: data.results.filter(event => new Date(event.start_date) > new Date()).length,
                        total_tickets: data.results.reduce((total, event) => total + event.capacity, 0),
                        ticket_available: data.results.reduce((total, event) => total + event.available, 0)
                    }
                    setDashboard({ ...dash, tickets_sold: dash.total_tickets - dash.ticket_available });
                } else if (response.status === 401) {
                    localStorage.clear();
                    newAlert("Auth Token Expired", "warning");
                    setTimeout(() => {
                        navigate("/");
                        setIsLoggedIn(false);
                    }, 1000);
                } else {
                    newAlert(data.message, "danger");
                }
            } catch (err) {
                newAlert(err.message, "danger");
            }
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            getEvents();
        } else {
            navigate("/");
        }
    }, [change]);
    return (
        <div className="container mt-5 mb-3">
            {/* Dashboard Stats */}
            {showAlert && (
                <div
                    className={`alert alert-${alertType} position-fixed`}
                    style={{ top: "100px", right: "20px", width: "auto", zIndex: "100" }}
                    role="alert"
                >
                    {alertMessage}
                </div>
            )}
            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body text-center">
                            <h4>Total Events</h4>
                            <p>{dashboard.total_events}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body text-center">
                            <h4>Upcoming Events</h4>
                            <p>{dashboard.upcoming_events}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body text-center">
                            <h4>Tickets Count</h4>
                            <p>{dashboard.total_tickets}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body text-center">
                            <h4>Tickets Sold</h4>
                            <p>{dashboard.tickets_sold}</p>
                        </div>
                    </div>
                </div>
                {/* Add more stats if needed */}
            </div>

            {/* Event List */}
            <div className="row mb-3">
                <div className="col-md-12">
                    <h3 className='mb-0'>My Events</h3>
                </div>
            </div>
            <div className="row mb-5">
                <div className="col-md-12">
                    {events.length === 0 ? (
                        <div className="text-center">
                            <h3>No events yet</h3>
                            <button className="btn btn-primary" onClick={() => navigate('/create-event')}>Create Event</button>
                        </div>
                    ) : (
                        <div className="container mt-5">
                            {/* Render event cards */}
                            {events.map((event, index) => (
                                <MyEventCard key={event.id} event={event} change={change} setChange={setChange} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyEvents;
