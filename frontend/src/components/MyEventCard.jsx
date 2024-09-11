import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginContext } from '../App';

const MyEventCard = ({ event, change, setChange }) => {
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn } = useContext(loginContext);
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
        return dateObj.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
    }
    function formatTime(timeInput) {
        const [hours, minutes] = timeInput.split(':');
        const date = new Date();
        date.setHours(hours, minutes);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    const handlePrivacyUpdate = async () => {
        if (event.capacity != event.available) {
            newAlert("Some Tickets have been booked, Contact Admin to Update !!!", "warning");
            return;
        }
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

    const handleUpdate = () => {
        if (event.capacity != event.available) {
            newAlert("Some Tickets have been booked, Contact Admin to Update !!!", "warning");
        } else {
            navigate(`/update-event/${event.id}`);
        }
    }

    const handleDelete = async () => {
        if (event.capacity != event.available) {
            newAlert("Some Tickets have been booked, Contact Admin to Delete !!!", "warning");
        } else {
            navigate(`/update-event/${event.id}`);
        }
    }

    // Activites
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [showAttendeeListModal, setShowAttendeeListModal] = useState(false);
    const [showQnA, setShowQnA] = useState(false);
    const [showDiscussions, setShowDiscussions] = useState(false);
    const [showPoll, setShowPoll] = useState(false);
    const [sendNotificationBtn, setSendNotificationBtn] = useState(false);
    const [attendees, setAttendees] = useState([]);
    const [ticketSales, setTicketSales] = useState({ ticket: 0, revenue: 0 });
    const [notification, setNotification] = useState({ title: '', message: '' });

    const handleNotificationBtn = () => {
        if (event.capacity === event.available) {
            newAlert("No Tickets booked yet !!!", "warning");
        } else {
            setShowNotificationModal(true);
        }
    }
    const handleNotification = (e) => {
        e.preventDefault();
        sendNotification();
    };

    const handleAttendee = () => {
        if (event.capacity === event.available) {
            newAlert("No Tickets booked yet !!!", "warning");
        } else {
            newAlert("Fetching Attendees List !!!", "info");
            getAttendees();
        }
    }

    const getAttendees = async () => {
        if (isLoggedIn) {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BASE_URL}/events/website/api/event-attendee-list-api/${event.id}/`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("access")}`,
                        },
                    }
                );
                const data = await response.json();
                if (response.ok) {
                    setAttendees([...data]);
                    setTicketSales(data.reduce((acc, item) => { acc.ticket += item.total_ticket_count; acc.revenue += item.total_price_paid; return acc; }, { ticket: 0, revenue: 0 }))
                    setShowAttendeeListModal(true);
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

    const sendNotification = async () => {
        setSendNotificationBtn(true);
        newAlert("Sending Notifications to all attendees", "info");
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/notifications/website/api/send-event-notification/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("access")}`,
                    },
                    body: JSON.stringify({ event: event.id, title: notification.title, message: notification.message }),
                }
            );
            const data = await response.json();
            if (response.ok) {
                newAlert("Notifications Sent successful", "success");
                setNotification({ title: '', message: '' });
                setShowNotificationModal(false);
            } else {
                newAlert("Unable to send notification, Try again later !!!", "warning");
            }
        } catch (err) {
            newAlert(err.message, "danger");
        };
        setSendNotificationBtn(false);
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
            <div className="card mb-3">
                <div className="row no-gutters">
                    {/* Left side with poster */}
                    <div className="col-md-3">
                        <img src={event?.poster ? `${import.meta.env.VITE_BASE_URL}${event.poster}` : "https://via.placeholder.com/150"} className="card-img p-3" style={{ borderRadius: "10%", maxHeight: "200px" }} alt="Event Poster" />
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
                            <p className="card-text mt-4 mb-0">Privacy&nbsp;&nbsp;&nbsp; : {event.is_private ? "Private" : "Public"}</p>
                            <p className="card-text mb-0">Capacity&nbsp; : {event.capacity}</p>
                            <p className="card-text mb-4">Available&nbsp; : {event.available}</p>
                            <button className=" btn  btn-outline-primary" onClick={handleAttendee} >List of Attendees</button>
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
                                        Make {event.is_private ? "Public" : "Private"}
                                    </button>
                                    <button className="dropdown-item" onClick={handleUpdate}>
                                        Update Event
                                    </button>
                                    <button className="dropdown-item text-danger" onClick={handleDelete}>
                                        Delete Event
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* Organiser Controls */}
                <div className="card-footer">
                    <div className="d-flex gap-5 align-items-center justify-content-evenly">
                        <div className="d-flex align-items-center">
                            <p className="h5 fw-bold mb-0 me-1">Live Q/A</p>
                            <div className="form-check form-switch ms-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="toggleQnA"
                                    onChange={() => setShowQnA(!showQnA)}
                                />
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <p className="h5 fw-bold mb-0me-1">Discussions</p>
                            <div className="form-check form-switch ms-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="toggleDiscussions"
                                    onChange={() => setShowDiscussions(!showDiscussions)}
                                />
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <p className="h5 fw-bold mb-0 me-1">Poll</p>
                            <div className="form-check form-switch ms-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="togglePrivacy"
                                    onChange={() => setShowPoll(!showPoll)}
                                />
                            </div>
                        </div>
                        <button className="btn btn-outline-info" onClick={handleNotificationBtn}>
                            Send Notification
                        </button>
                        {showPoll && <button className="btn btn-outline-info" disabled={sendNotificationBtn} onClick={() => setShowNotificationModal(true)}>
                            Create Poll
                        </button>
                        }

                    </div>
                </div>
            </div>
            {/* Notification Modal */}
            {showNotificationModal && (
                <div className="modal show" tabIndex="-1" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Send Notification for "{event.title}"</h5>
                                <button type="button" className="btn-close" onClick={() => setShowNotificationModal(false)}></button>
                            </div>
                            <form onSubmit={handleNotification}>
                                <div className="modal-body">
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Title"
                                        value={notification.title}
                                        onChange={(e) => setNotification({ ...notification, title: e.target.value })}
                                        required
                                    />
                                    <textarea
                                        className="form-control"
                                        placeholder="Message for Audience"
                                        required
                                        value={notification.message}
                                        onChange={(e) => setNotification({ ...notification, message: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" disabled={sendNotificationBtn} className="btn btn-primary">
                                        Send Notification
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Attendee List Modal */}
            {showAttendeeListModal && (
                <div className="modal show" tabIndex="-1" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Attendee List</h5>
                                <button type="button" className="btn-close" onClick={() => setShowAttendeeListModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row mb-3">
                                    <div className="col"></div>
                                    <div className="col">Tickets Sold: {ticketSales.ticket}</div>
                                    <div className="col">Revenue: &#8377;{ticketSales.revenue}</div>
                                    <div className="col"></div>
                                </div>
                                <hr />
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Contact Email</th>
                                            <th>Tickets Bought</th>
                                            <th>Amount Paid</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendees.map((attendee, idx) => (
                                            <tr key={idx}>
                                                <td>{attendee.user.first_name} {attendee.user.last_name}</td>
                                                <td>{attendee.user.email}</td>
                                                <td>{attendee.total_ticket_count}</td>
                                                <td>{attendee.total_price_paid}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            )}</>
    );
};

export default MyEventCard;