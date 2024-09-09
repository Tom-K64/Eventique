import React, { useEffect, useState, useContext } from 'react';
import EventCard from '../components/EventCard';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { loginContext } from '../App';

const AllEvents = () => {
    const { isSearch } = useContext(loginContext);
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get('search', null);
    const [filters, setFilters] = useState({
        category: "all",
        price: '0',
        date: "",
        sort_by: "-created_at"
    });

    const handleFilterChange = (e) => {
        const { id, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [id]: value,
        }));
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

    const getEvents = async (url) => {
        try {
            const response = await fetch(url);
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

    const [category, setCategory] = useState([]);
    const getCategory = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/events/website/api/category-list-api/`);
            const data = await response.json();
            if (response.ok) {
                setCategory(data);
            } else {
                newAlert(data.message, "danger");
            }
        } catch (err) {
            newAlert(err.message, "danger");
        }
    };

    const handleFilters = () => {
        console.log(filters);
        let filter = "?custom=1";
        if (filters.category !== "all") { filter += `&category=${filters.category}`; }
        if (filters.price !== '0' && filter.price !== '9999') { filter += `&price_range=${(String(filters.price))}`; }
        if (filters.date !== "") { filter += `&start_date=${filters.date}`; }
        if (filters.sort_by !== "all") { filter += `&ordering=${filters.sort_by}`; }
        console.log(filter);
        getEvents(`${import.meta.env.VITE_BASE_URL}/events/website/api/event-list-api/${filter}`);
    };

    useEffect(() => {
        if (search) {
            getEvents(`${import.meta.env.VITE_BASE_URL}/events/website/api/event-list-api/?search=${search}`);
        } else {
            getEvents(`${import.meta.env.VITE_BASE_URL}/events/website/api/event-list-api/`);
        }
        getCategory();
    }, [isSearch]);

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
                <div className="row">
                    {/* Filters & Sorting Section */}
                    <div className="col-md-3">
                        <div className="card p-3">
                            <h5 className="card-title">Filters</h5>

                            {/* Category Filter */}
                            <div className="form-group">
                                <label htmlFor="category">Category</label>
                                <select
                                    className="form-control"
                                    id="category"
                                    value={filters.category}
                                    onChange={handleFilterChange}
                                >
                                    <option value="all">All</option>
                                    {category.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Filter */}
                            <div className="form-group mt-3">
                                <label htmlFor="price">Price Range</label>
                                <input
                                    type="range"
                                    className="form-range"
                                    id="price"
                                    min="0"
                                    max="9999"
                                    value={filters.price}
                                    onChange={handleFilterChange}
                                />
                                <small className="text-muted">0 - 9999</small>
                            </div>

                            {/* Date Filter */}
                            <div className="form-group mt-3">
                                <label htmlFor="date">Date Range</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="date"
                                    value={filters.date}
                                    onChange={handleFilterChange}
                                />
                            </div>

                            {/* Sorting Section */}
                            <h5 className="mt-4">Sort By</h5>
                            <div className="form-group">
                                <select
                                    className="form-control"
                                    id="sort_by"
                                    value={filters.sort_by}
                                    onChange={handleFilterChange}
                                >
                                    <option value="-created_at">Recently Posted</option>
                                    <option value="title">Title (abc..)</option>
                                    <option value="-title">Title (zyx..)</option>
                                    <option value="price_range">Price (Low to High)</option>
                                    <option value="-price_range">Price (High to Low)</option>
                                </select>
                            </div>

                            {/* Apply Button */}
                            <button className="btn btn-primary mt-4 w-100" onClick={handleFilters}>
                                Apply Changes
                            </button>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="row">
                            {events.length!=0 ? events.map((event) => (
                                <div className="col-md-4" key={event.id} onClick={(e) => navigate(`/event/${event.id}`)}>
                                    <EventCard data={event} />
                                </div>
                            )):(
                                <div className="col-md-12 text-center mt-5"><h1>No events found.</h1></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {events.length<=8?<></>:(
                <div className="container text-center">
                <button className='btn btn-outline-success' onClick={() => navigate("/events")}>Load More Events</button>
            </div>
            )}
            
        </div>
    );
};

export default AllEvents;
