import React from 'react';

const EventCard = ({data}) => {
    function formatDate(dateInput) {
        const dateObj = new Date(dateInput);
        
        const options = { weekday: 'short', day: '2-digit', month: 'short' };
        return dateObj.toLocaleDateString('en-US', options);
      }
      function formatTime(timeInput) {
        const [hours, minutes] = timeInput.split(':');
        const date = new Date();
        date.setHours(hours, minutes);
      
        const options = { hour: 'numeric', minute: '2-digit', hour12: true };
        return date.toLocaleTimeString('en-US', options);
      }
    return (
        <>
            <div className="card mb-3">
                <img className="card-img-top p-2" src={ data?.poster ? `${import.meta.env.VITE_BASE_URL}${data.poster}`:"https://via.placeholder.com/150"} alt="Card image cap" style={{borderTopLeftRadius:"10%",borderTopRightRadius:"10%" , height:'240px'}}/>
                    <div className="card-body py-1">
                    <h5 className="card-title text-justify" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data?.title}</h5>
                    <p className="card- mb-0" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data?.venue} | {data?.location}</p>
                    <small>{data?.category}</small>
                    <p className="card-text text-muted"><small>{formatDate(data?.start_date)} at {formatTime(data?.start_time)}</small><br/><span>&#8377;{data?.price_range} <small>onwards</small></span></p>
                    </div>
            </div>
        </>
    );
};

export default EventCard;
