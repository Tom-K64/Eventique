import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { loginContext } from '../App';

const UpdateEvent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { isLoggedIn, setIsLoggedIn } = useContext(loginContext);
    const [category, setCategory] = useState([]);
    const [eventDetails, setEventDetails] = useState({
        title: 'Sample Event Title',
        description: 'Sample event description...',
        poster: 'https://via.placeholder.com/150',
        category: 1,
        venue: 'Sample Venue',
        location: 'Sample Location',
        start_date: '2024-09-10',
        start_time: '18:00',
        is_private: true,
    });

    const [ticketTypes, setTicketTypes] = useState([
        { title: 'VIP', description: 'VIP Access', price: '100', quantity: '50' },
        { title: 'General', description: 'General Access', price: '50', quantity: '200' }
    ]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;        
        setEventDetails(prevState => ({ ...prevState, [name]: value }));
    };
    const handleRadioChange = (e) => {
        const { name, value } = e.target;        
        setEventDetails(prevState => ({ ...prevState, [name]: value === 'true' }));
    };

    const handlePosterChange = (e) => {
        setEventDetails(prevState => ({ ...prevState, poster: e.target.files[0],pic_uploaded:true }));
    };

    const handleTicketChange = (index, e) => {
        const { name, value } = e.target;
        const newTicketTypes = [...ticketTypes];
        newTicketTypes[index] = { ...newTicketTypes[index], [name]: value };
        setTicketTypes(newTicketTypes);
    };

    const addTicketType = () => {
        setTicketTypes([...ticketTypes, { title: '', description: '', price: '', quantity: '' }]);
    };

    const handleDeleteTicket = (index) => {
        setTicketTypes(prevTypes => prevTypes.filter((_, i) => i !== index));
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(eventDetails).forEach(([key, value]) => {
            formData.append(key, value);
        });
        ticketTypes.forEach((ticket, index) => {
            Object.entries(ticket).forEach(([key, value]) => {
                formData.append(`ticket_types[${index}][${key}]`, value);
            });
        });
        formData.append('type_count', ticketTypes.length);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BASE_URL}/events/website/api/event-generic-api/${id}/`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`,
                    },
                    body: formData
                }
            );
            const data = await response.json();
            if (response.ok) {
                newAlert("Event Updated Successfully", "success");
                setTimeout(() => {
                    navigate(`/event/${id}`);
                }, 1000);
            } else if (response.status === 401) {
                localStorage.clear();
                newAlert("Auth Token Expired", "warning");
                setTimeout(() => {
                    navigate("/");
                    setIsLoggedIn(false);
                }, 2000);
            } else {
                newAlert(data.message, "danger");
            }
        } catch (e) {
            newAlert(e.message, "danger");
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

    const getCategory = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/events/website/api/category-list-api/`);
            const data = await response.json();
            if (response.ok) {
                setCategory(data);
                setEventDetails(prevState => ({ ...prevState, category: data[0].id }));
            } else {
                newAlert(data.message, "danger");
            }
        } catch (err) {
            newAlert(err.message, "danger");
        }
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
                    description: data.description,
                    poster: data.poster ? `${import.meta.env.VITE_BASE_URL}${data.poster}`:'https://via.placeholder.com/150',
                    category: data.category.id,
                    venue: data.venue,
                    location: data.location,
                    start_date: data.start_date,
                    start_time: data.start_time,
                    is_private: data.is_private,
                });
                setTicketTypes([...data.ticket_types]);
            } else {
                newAlert(data.message, "danger");
            }
        } catch (err) {
            newAlert(err.message, "danger");
        }
    };

    useEffect(() => {
        getCategory();
        getEventDetail();
    }, []);

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

            <div className="container mt-5">
                <h2 >Update Event</h2>
                <form onSubmit={handleSubmit}>
                    {/* Poster Preview and Update */}
                    <div className="row mb-4 text-center">
                        <div className="col-md-12">
                            <img
                                src={typeof eventDetails.poster === "string" ? eventDetails.poster : URL.createObjectURL(eventDetails.poster)}
                                alt="Event Poster"
                                className="img-thumbnail"
                                style={{ maxWidth: '300px', marginBottom: '15px' }}
                            />
                            <div className="form-group">
                                <label htmlFor="formEventPoster">Change Poster</label>
                                <input
                                    type="file"
                                    className="form-control-file"
                                    id="formEventPoster"
                                    onChange={handlePosterChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Event Details */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="formEventTitle">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="formEventTitle"
                                    placeholder="Enter event title"
                                    name="title"
                                    value={eventDetails.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">

                            <div className="form-group">
                                <label htmlFor="eventCategory">Category</label>
                                <select
                                    id='eventCategory'
                                    className="form-select"
                                    name="category"
                                    value={eventDetails.category}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {category.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label htmlFor="formEventDescription">Description</label>
                                <textarea
                                    className="form-control"
                                    id="formEventDescription"
                                    rows="3"
                                    placeholder="Enter event description"
                                    name="description"
                                    value={eventDetails.description}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="eventVenue">Venue</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="eventVenue"
                                    placeholder="Enter event location"
                                    name="venue"
                                    value={eventDetails.venue}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="eventLocation">Location</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="eventLocation"
                                    placeholder="Enter event location"
                                    name="location"
                                    value={eventDetails.location}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="formEventDate">Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="formEventDate"
                                    name="start_date"
                                    value={eventDetails.start_date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="formEventTime">Time</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    id="formEventTime"
                                    name="start_time"
                                    value={eventDetails.start_time}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>



                    {/* Privacy Settings */}
                    <div className="row mb-4">
                        <div className="col-md-12">
                            <label className='me-4'>Privacy :</label>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id="privacyPublic"
                                    name="is_private"
                                    value={false}
                                    checked={!eventDetails.is_private}
                                    onChange={handleRadioChange}
                                />
                                <label className="form-check-label" htmlFor="privacyPublic">Public</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id="privacyPrivate"
                                    name="is_private"
                                    value={true}
                                    checked={eventDetails.is_private}
                                    onChange={handleRadioChange}
                                />
                                <label className="form-check-label" htmlFor="privacyPrivate">Private</label>
                            </div>
                        </div>
                    </div>

                    {/* Ticket Types */}
                    <h4 className="mb-3">Ticket Types</h4>
                    {ticketTypes.map((ticket, index) => (
                        <div className="card mb-3" key={index}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label>Ticket Type Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="title"
                                                value={ticket.title}
                                                onChange={(e) => handleTicketChange(index, e)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Short Description</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="description"
                                                value={ticket.description}
                                                onChange={(e) => handleTicketChange(index, e)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label>Price</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="price"
                                                value={ticket.price}
                                                onChange={(e) => handleTicketChange(index, e)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label>Tickets Available</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="quantity"
                                                value={ticket.quantity}
                                                onChange={(e) => handleTicketChange(index, e)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-1 d-flex align-items-center justify-content-center">
                                        {/* Delete icon or button */}
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => handleDeleteTicket(index)}
                                        >
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button type="button" className="btn btn-outline-primary mb-3" onClick={addTicketType}>
                        + Add Ticket Type
                    </button>
                    <br />
                    {/* Submit Button */}
                    <button type="submit" className="btn btn-primary">
                        Update Event
                    </button>
                </form>
            </div>
        </>
    );
};

export default UpdateEvent;
