import React, { useState, useContext, useEffect } from 'react';
import { loginContext } from '../App';

const EventCreation = () => {
    const { isLoggedIn, setIsLoggedIn } = useContext(loginContext);
    const [ticketTypes, setTicketTypes] = useState([{ title: '', description: '', price: '', quantity: '' }]);
    const [category, setCategory] = useState([]);
    const [eventDetails, setEventDetails] = useState({
        title: '',
        description: '',
        poster: '',
        category: '',
        venue: '',
        location: '',
        start_date: '',
        start_time: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventDetails(prevState => ({ ...prevState, [name]: value }));
    };

    const handleImageChange = (e) => {
        const { name } = e.target;
        const file = e.target.files[0];
        if (file) {
            setEventDetails(prevState => ({ ...prevState, [name]: file, pic_uploaded: true }));
        }
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

        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
          }

          try {
            const response = await fetch(
                `${import.meta.env.VITE_BASE_URL}/events/website/api/create-event/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`,
                    },
                    body: formData
                }
            );
            const data = await response.json();
            if (response.ok) {
                newAlert("Event Created Successfully", "success");
                setTimeout(() => {
                    navigate("/my-events");
                }, 1000);
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
        } catch (e) {
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

    useEffect(() => {
        getCategory();
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
                <h3 className="mb-4">Create Event</h3>
                <form onSubmit={handleSubmit}>
                    {/* Event Details */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="eventTitle">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="eventTitle"
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
                                <label htmlFor="eventPoster">Poster</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control"
                                    id="eventPoster"
                                    placeholder="Enter poster URL"
                                    name="poster"
                                    // value={eventDetails.poster}
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label htmlFor="eventDescription">Description</label>
                                <textarea
                                    className="form-control"
                                    id="eventDescription"
                                    rows="3"
                                    placeholder="Enter event description"
                                    name="description"
                                    value={eventDetails.description}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-md-12">

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
                                <label htmlFor="eventDate">Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="eventDate"
                                    name="start_date"
                                    value={eventDetails.start_date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="eventTime">Time</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    id="eventTime"
                                    name="start_time"
                                    value={eventDetails.start_time}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Ticket Types */}
                    <h4 className="mb-3">Ticket Types</h4>
                    {ticketTypes.map((ticket, index) => (
                        <div className="card mb-3" key={index}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor={`ticketTitle${index}`}>Ticket Type Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id={`ticketTitle${index}`}
                                                placeholder="Enter ticket type title"
                                                name="title"
                                                value={ticket.title}
                                                onChange={(e) => handleTicketChange(index, e)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor={`ticketDescription${index}`}>Short Description</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id={`ticketDescription${index}`}
                                                placeholder="Enter short description"
                                                name="description"
                                                value={ticket.description}
                                                onChange={(e) => handleTicketChange(index, e)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label htmlFor={`ticketPrice${index}`}>Price</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id={`ticketPrice${index}`}
                                                placeholder="Price"
                                                name="price"
                                                value={ticket.price}
                                                onChange={(e) => handleTicketChange(index, e)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label htmlFor={`ticketsAvailable${index}`}>Tickets Available</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id={`ticketsAvailable${index}`}
                                                placeholder="Tickets available"
                                                name="quantity"
                                                value={ticket.quantity}
                                                onChange={(e) => handleTicketChange(index, e)}
                                                required
                                            />
                                        </div>
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
                        Submit
                    </button>
                </form>
            </div>
        </>
    );
};

export default EventCreation;
