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
    const [showPollModal, setShowPollModal] = useState(false);
    const [showQnA, setShowQnA] = useState(event.qna_is_active);
    const [showDiscussions, setShowDiscussions] = useState(event.forum_is_active);
    const [showPoll, setShowPoll] = useState(event.poll_is_active);
    const [sendNotificationBtn, setSendNotificationBtn] = useState(false);
    const [pollBtn, setPollBtn] = useState(false);
    const [attendees, setAttendees] = useState([]);
    const [ticketSales, setTicketSales] = useState({ ticket: 0, revenue: 0 });
    const [notification, setNotification] = useState({ title: '', message: '' });
    const [poll, setPoll] = useState({ question: '', options: ['', ''], });

    const handleQuestionChange = (e) => {
        setPoll({ ...poll, question: e.target.value });
    };

    const handleOptionChange = (index, value) => {
        const updatedOptions = [...poll.options];
        updatedOptions[index] = value;
        setPoll({ ...poll, options: updatedOptions });
    };

    const addOption = () => {
        setPoll({ ...poll, options: [...poll.options, ''] });
    };


    const handleCreatePoll = async(e) => {
        e.preventDefault();
        setPollBtn(true);
        newAlert("Poll is being Created !!!","info");
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/activities/website/api/event-poll-create-api/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("access")}`,
                    },
                    body: JSON.stringify({ event: event.id, ...poll }),
                }
            );
            const data = await response.json();
            if (response.ok) {
                newAlert("Poll created successful", "success");
                setPoll({ question: '', options: ['', ''], });
            } else {
                newAlert("Unable to Create Poll, Try again later !!!", "warning");
            }
        } catch (err) {
            newAlert(err.message, "danger");
        };
        setShowPollModal(false);
        setPollBtn(false);
    };

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

    const handleQA = () => {
        handleActivityChange({ qna_is_active: !showQnA })
    }

    const handleDiscussion = () => {
        handleActivityChange({ forum_is_active: !showDiscussions })
    }

    const handlePoll = () => {
        handleActivityChange({ poll_is_active: !showPoll })
    }

    const handleActivityChange = async (changeData) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BASE_URL}/events/website/api/event-activity-update-api/${event.id}/`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(changeData),
                }
            );
            const data = await response.json();
            if (response.ok) {
                setShowQnA(data.qna_is_active);
                setShowDiscussions(data.forum_is_active);
                setShowPoll(data.poll_is_active);
                newAlert("Status Changed successfully !!!", "success");
            } else {
                newAlert(`${data?.message}   x`, "danger");
            }
        } catch (e) {
            newAlert(`${e.message}`, "warning");
        }
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
                            <button className=" btn  btn-outline-secondary" onClick={() => navigate(`/event/${event.id}`)} >Go to Event Page&nbsp; <i className="fa-solid fa-arrow-up-right-from-square"></i></button>
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
                                    checked={showQnA}
                                    onChange={handleQA}
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
                                    checked={showDiscussions}
                                    onChange={handleDiscussion}
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
                                    checked={showPoll}
                                    onChange={handlePoll}
                                />
                            </div>
                        </div>
                        {showPoll && <button className="btn btn-outline-info" disabled={pollBtn} onClick={() => setShowPollModal(true)}>
                            Create Poll
                        </button>
                        }
                        <button className=" btn  btn-outline-info" onClick={handleAttendee} >List of Attendees</button>
                        <button className="btn btn-outline-info" onClick={handleNotificationBtn}>
                            Send Notification
                        </button>

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

            {/* Create Poll Modal */}
            {showPollModal && (
                <div className="modal show" tabIndex="-1" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Create Poll for "{event.title}"</h5>
                                <button type="button" className="btn-close" onClick={() => setShowPollModal(false)}></button>
                            </div>
                            <form onSubmit={handleCreatePoll}>
                                <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="pollQuestion" className="form-label">Poll Question</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="pollQuestion"
                                        placeholder="Enter your poll question"
                                        value={poll.question}
                                        onChange={handleQuestionChange}
                                        required
                                    />
                                </div>

                                {poll.options.map((option, index) => (
                                    <div className="mb-3" key={index}>
                                        <label htmlFor={`option${index}`} className="form-label">Option {index + 1}</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id={`option${index}`}
                                            placeholder={`Enter option ${index + 1}`}
                                            value={option}
                                            onChange={(e) => handleOptionChange(index, e.target.value)}
                                            required
                                        />
                                    </div>
                                ))}

                                <button type="button" className="btn btn-secondary mb-3" onClick={addOption}>
                                    Add More Option
                                </button>

                                <div className="d-grid">
                                    <button type="submit" disabled={pollBtn} className="btn btn-primary">
                                        Create Poll
                                    </button>
                                </div>
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