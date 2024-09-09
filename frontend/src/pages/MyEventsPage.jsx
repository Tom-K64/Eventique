import React, { useState } from 'react';
import MyEventCard from '../components/MyEventCard';


const MyEvents = () => {
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
            {/* Dashboard Stats */}
            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body text-center">
                            <h4>Total Events</h4>
                            <p>{events.length}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body text-center">
                            <h4>Upcoming Events</h4>
                            <p>{events.filter(event => new Date(event.date) >= new Date()).length}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body text-center">
                            <h4>Tickets Tickets</h4>
                            <p>{events.reduce((total, event) => total + event.soldTickets, 0)}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body text-center">
                            <h4>Tickets Sold</h4>
                            <p>{events.reduce((total, event) => total + event.soldTickets, 0)}</p>
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
            <div className="row mb-4">
                <div className="col-md-12">
                    {events.length === 0 ? (
                        <div className="text-center">
                            <h3>No events yet</h3>
                            <button className="btn btn-primary">Create Event</button>
                        </div>
                    ) : (
                        <div className="container mt-5">
                            {/* Render event cards */}
                            {events.map((event, index) => (
                                <MyEventCard key={event.id} event={event} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyEvents;
