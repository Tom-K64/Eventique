import React, { useState } from "react";

const MyEventCard = ({ event }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [discussionOn, setDiscussionOn] = useState(false);
    const [qaOn, setQaOn] = useState(false);
    const [privateOn, setPrivateOn] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleToggle = (toggleState, setToggleState) => {
        setToggleState(!toggleState);
    };

    return (
        <div className="card mb-3">
            <div className="row no-gutters">
                {/* Left side with poster */}
                <div className="col-md-3">
                    <img src={event.poster} className="card-img p-3" style={{ borderRadius: "10%", maxHeight: "200px" }} alt="Event Poster" />
                </div>

                {/* Right side with event details */}
                <div className="col-md-1"></div>
                <div className="col-md-4">
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
                        <p className="card-text mt-4 mb-0">Privacy&nbsp;&nbsp;&nbsp; : Private</p>
                        <p className="card-text mb-0">Capacity&nbsp; : 100</p>
                        <p className="card-text">Available&nbsp; : 50</p>
                        <p className="card-text mb-0 text-muted">List of Attendees</p>
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
                                <a className="dropdown-item" href="#">
                                    Make Private
                                </a>
                                <a className="dropdown-item" href="#">
                                    Update Event
                                </a>
                                <a className="dropdown-item text-danger" href="#">
                                    Delete Event
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyEventCard;