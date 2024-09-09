import React, { useState } from 'react';
import QRCode from 'react-qr-code';

const MyBoookings = () => {
    const [events, setEvents] = useState([
        {
            id: 1,
            title: 'Event One',
            poster: 'https://via.placeholder.com/150',
            totalTickets: 100,
            soldTickets: 80,
        },
        {
            id: 2,
            title: 'Event Two',
            poster: 'https://via.placeholder.com/150',
            totalTickets: 200,
            soldTickets: 150,
        },
    ]);
    return (
        <div className="container mt-5 mb-3">
            {/* Event List */}
            <div className="row mb-3">
                <div className="col-md-12">
                    <h3 className='mb-0'>My Bookings</h3>
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-md-12">
                    {events.length === 0 ? (
                        <div className="text-center">
                            <h3>No Bookings yet</h3>
                            <button className="btn btn-primary">Explore Events</button>
                        </div>
                    ) : (
                        <div className="container mt-5">
                            {events.map((event, index) => (
                                <div className="card mb-3" key={index}>
                                    <div className="row no-gutters">
                                        {/* Left side with poster */}
                                        <div className="col-md-3">
                                            <img src={event.poster} className="card-img p-3" style={{ borderRadius: "10%", maxHeight: "200px" }} alt="Event Poster" />
                                        </div>
                                        <div className="col-md-3">
                                            <div className="card-body">
                                                <h5 className="card-title">{event.title}</h5>
                                                <p className="card-text mb-0">Category : {event.totalTickets}</p>
                                                <p className="card-text mb-0">Venue&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : {event.totalTickets}</p>
                                                <p className="card-text mb-0">Location&nbsp; : {event.totalTickets}</p>
                                                <p className="card-text mb-0">Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : {event.totalTickets}</p>
                                                <p className="card-text mb-0">Time&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : {event.totalTickets}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3 ">
                                            <div className="card-body">
                                                <p className="card-text mt-4 mb-0">Tickets&nbsp;&nbsp;&nbsp; : Private</p>
                                                <p className="card-text mb-0">Capacity&nbsp; : 100</p>
                                                <p className="card-text">Available&nbsp; : 50</p>
                                                <p className="card-text mb-0 text-muted">List of Attendees</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3 d-flex justify-content-center align-items-center">
                                            <QRCode value={`https://youreventplatform.com/event/${event.id}`} size={128} />
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
