import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { loginContext } from '../App';

const EventDetails = () => {
  const { id } = useParams();
  const { isLoggedIn } = useContext(loginContext);
  const navigate = useNavigate();
  const [event, setEvent] = useState(
    {
      "id": 6,
      "title": "Dummy Title",
      "description": "Dummy Event Description",
      "start_date": "2024-09-12",
      "start_time": "13:30",
      "venue": "Dummy Venue",
      "location": "Dummy Location",
      "category": "Dummy Category",
      "price_range": 999,
      "poster": null,
      "capacity": 25,
      "available": 25,
      "qna_is_active": false,
      "forum_is_active": false,
      "poll_is_active": false,
    }
  );
  const handleBook = () => {
    if (isLoggedIn) {
      navigate(`/book-tickets/${event.id}`);
    } else {
      newAlert("Please Login to Book Tickets", "warning");
    }
  }

  const getEvent = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/events/website/api/event-detail-api/${id}/`);
      const data = await response.json();
      if (response.ok) {
        setEvent(data);
        setIsOrganiser(data?.organiser === localStorage.getItem('user_id', 'none') ? true : false);
        setShowDiscussions(data.forum_is_active);
        setShowQnA(data.qna_is_active);
        setShowPoll(data.poll_is_active);
      } else {
        newAlert(data.message, "danger");
      }
    } catch (err) {
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

  useEffect(() => {
    getEvent();
  }, []);

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

  function formatMsgTime(Input) {
    const date = new Date(Input);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  //Activities
  const [isOrganiser, setIsOrganiser] = useState(false);
  const getData = async (url, setTo) => {
    try {
      const response = await fetch(url,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setTo([...data]);
      } else {
        newAlert(`Unable to fetch Data`, "danger");
        // navigate("/");
      }
    } catch (e) {
      newAlert(`${e.message}`, "warning");
    }
  }

  const [showQnA, setShowQnA] = useState(false);
  const [showDiscussions, setShowDiscussions] = useState(false);
  const [showPoll, setShowPoll] = useState(false);

  //Polls
  const [polls, setPolls] = useState([]);
  const [pollRef, setPollRef] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState({});

  // Handle selecting an option
  const handleOptionChange = (pollId, index) => {
    setSelectedOptions({ ...selectedOptions, [pollId]: index });
  };

  // Handle voting
  const handleVote = async(pollId,pollIndex) => {
    const selectedOptionIndex = selectedOptions[pollId];
    console.log(polls[pollIndex].options[selectedOptionIndex].option);
    
    if (selectedOptionIndex !== undefined) {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/activities/website/api/event-poll-update-api/${pollId}/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
            body: JSON.stringify({ option: polls[pollIndex].options[selectedOptionIndex].id }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          newAlert("Voted successful", "success");
          setPollRef(!pollRef);
        } else {
          newAlert("Unable to Vote, Try again later !!!", "warning");
        }
      } catch (err) {
        newAlert(err.message, "danger");
      };
      console.log(`Poll ID: ${pollId}, Selected Option: Option ${selectedOptionIndex + 1}`);
    } else {
      console.log('No option selected for poll', pollId);
    }
  };

  //Q/A
  const [questions, setQuestions] = useState([]);

  const [newQuestion, setNewQuestion] = useState('');

  const handlePostQuestion = async (e) => {
    e.preventDefault();
    if (newQuestion.trim()) {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/activities/website/api/event-qa-create-api/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
            body: JSON.stringify({ event: id, question: newQuestion.trim(), username: currentUsername }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          newAlert("Question Posted successful", "success");
          setAnsRef(!ansRef);
          const newQ = {
            id: questions.length + 1,
            question: newQuestion.trim(),
            answer: '',
            isAnswered: false,
            username: currentUsername
          };
          setQuestions([...questions, newQ]);
        } else {
          newAlert("Unable to post question, Try again later !!!", "warning");
        }
      } catch (err) {
        newAlert(err.message, "danger");
      };


    } else {
      newAlert('please enter a valid question', 'warning');
    }
    setNewQuestion('');
  };

  //Discussion
  const [messages, setMessages] = useState([]);
  const [msgRef, setMsgRef] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const currentUsername = localStorage.getItem('first_name');

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/activities/website/api/event-forum-message-api/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
            body: JSON.stringify({ event: id, message: newMessage.trim() }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          const newQ = {
            id: questions.length + 1,
            question: newQuestion.trim(),
            answer: '',
            isAnswered: false,
            username: currentUsername
          };
          setQuestions([...questions, newQ]);
          setMsgRef(!msgRef);
        } else {
          newAlert("Unable to send message question, Try again later !!!", "warning");
        }
      } catch (err) {
        newAlert(err.message, "danger");
      };

      const newMsg = {
        id: messages.length + 1,
        username: currentUsername,
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMsg]);
    } else {
      newAlert('Please enter a valid message', 'warning');
    }
    setNewMessage('');
  };
  const [answer, setAnswer] = useState('');
  const [ansRef, setAnsRef] = useState(false);
  const [answerBtn, setAnswerBtn] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);

  const handleAnswer = async (e) => {
    e.preventDefault();
    setAnswerBtn(true);
    newAlert("Saving your answer ...", "info");
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/activities/website/api/event-qa-answer-api/${questions[questionIndex].id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify({ answer: answer }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        newAlert("Answer saved successful", "success");
        setAnswer("");
        setShowAnswerModal(false);
        setAnsRef(!ansRef);
      } else {
        newAlert("Unable to answer, Try again later !!!", "warning");
      }
    } catch (err) {
      newAlert(err.message, "danger");
    };
    setQuestionIndex(0);
    setAnswerBtn(false);
  }


  useEffect(() => {
    if (isLoggedIn && showPoll) {
      getData(`${import.meta.env.VITE_BASE_URL}/activities/website/api/event-poll-list-api/${id}/`, setPolls);
    }
  }, [isLoggedIn, showPoll,pollRef]);
  useEffect(() => {
    if (isLoggedIn && showQnA) {
      getData(`${import.meta.env.VITE_BASE_URL}/activities/website/api/event-qa-list-api/${id}/`, setQuestions);
    }
  }, [isLoggedIn, showQnA, ansRef]);

  useEffect(() => {
    if (isLoggedIn && showDiscussions) {
      getData(`${import.meta.env.VITE_BASE_URL}/activities/website/api/event-forum-list-api/${id}/`, setMessages);
    }
  }, [isLoggedIn, showDiscussions, msgRef]);

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
      <div className="container ">
        <div className="row ">
          <div className="col-md-12">
            <div className="card mt-3 mb-2 h-50 bg-light">
              <img className="card-img-top block" src={event?.poster ? `${import.meta.env.VITE_BASE_URL}${event.poster}` : "https://via.placeholder.com/150"} style={{ height: '20rem' }} alt="Card image cap" />
              <div className="card-body">
                <div className="row">
                  <div className="col-md-10">
                    <h5 className="card-title">{event?.title}</h5>
                    <p className="card-text mb-0">{event?.description}</p>
                    <p className="card-text"><small className="text-muted">{event?.category}</small></p>
                  </div>
                  <div className="col-md-2 d-flex justify-content-center align-items-center">
                    <button type="button" disabled={Boolean(!event?.available)} className="btn btn-danger p-3 fs-5" onClick={handleBook}>{event?.available != 0 ? "Book Now" : "Sold Out"}</button>
                  </div>
                </div>
                <hr />
                <span className='me-4'>{Object.keys(event).length === 0 ? "" : formatDate(event?.start_date)} at {Object.keys(event).length !== 0 ? formatTime(event?.start_time) : ""}</span><span className='me-4'><i className="fa fa-map-marker" >&nbsp;</i>{event?.venue} : {event?.location}</span> | &nbsp;&nbsp;<span>&#8377;{event?.price_range} <small>onwards</small></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isLoggedIn && <div className="container w-75 mt-3">
        {showPoll && <>
          <div className="container w-75 border mb-3">
            <h2>Polls Section</h2>
            <div className="container m-3 pt-2 mx-auto border rounded" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {polls.length === 0 ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                  <h5>No Polls Hosted Yet</h5>
                </div>
              ) : (
                polls.map((poll,pollIndex) => (
                  <div key={poll.id} className="card mb-3" style={{ width: '100%' }}>
                    <div className="card-body">
                      <h5 className="card-title">{poll.question}</h5>
                      {/* Render options */}
                      {poll.options.map((option, index) => (
                        <div key={index} className="mb-2">
                          {poll.is_voted ? (
                            <div>
                              <div className="d-flex justify-content-between">
                                <span>{option.option}</span>
                                <span>{Math.round((option.votes / poll.votes.length) * 100)}%</span>
                              </div>
                              <div className="progress">
                                <div
                                  className="progress-bar progress-bar-striped"
                                  role="progressbar"
                                  style={{ width: `${(option.votes / poll.votes.length) * 100}%` }}
                                  aria-valuenow={(option.votes / poll.votes.length) * 100}
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              </div>
                            </div>
                          ) : (
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name={`poll-${poll.id}`}
                                id={`option-${poll.id}-${index}`}
                                onChange={() => handleOptionChange(poll.id, index)}
                                checked={selectedOptions[poll.id] === index}
                              />
                              <label className="form-check-label" htmlFor={`option-${poll.id}-${index}`}>
                              {option.option}
                              </label>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Vote button */}
                      {!poll.is_voted && (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleVote(poll.id,pollIndex)}
                        >
                          Vote
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>}
        {showQnA && <>
          <div className='container w-75 border mb-3'>
            <h2 className='mt-1'>Q&A Section</h2>

            {/* Post a new question */}
            <form onSubmit={handlePostQuestion}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ask a question..."
                  value={newQuestion}
                  required
                  minLength={10}
                  onChange={(e) => setNewQuestion(e.target.value)}
                />
                <button type='submit'
                  className="btn btn-primary mt-2"
                >
                  Post Question
                </button>
              </div>
            </form>

            {/* Scrollable container for questions */}
            <div
              className="container border rounded p-2 mb-3  "
              style={{ height: '300px', overflowY: 'auto' }}
            >
              {questions.length === 0 ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                  <h5>No Questions asked Yet</h5>
                </div>
              ) : (questions.map((q, index) => (
                <div key={q.id} className="card mb-2">
                  <div className="card-body">
                    <h6 className="card-title">
                      {q.username} Asks: {q.question}
                    </h6>
                    {q.is_answered ? (
                      <p className="card-text text-justify">
                        <strong>Answer:</strong> {q.answer}
                        {isOrganiser && <button className='btn btn-link' disabled={answerBtn} onClick={() => { setShowAnswerModal(true); setQuestionIndex(index); }}>Add an Answer</button>}
                      </p>
                    ) : (
                      <p className="card-text text-muted">
                        No answer yet. {isOrganiser && <button className='btn btn-link' disabled={answerBtn} onClick={() => { setShowAnswerModal(true); setQuestionIndex(index); }}>Add an Answer</button>}
                      </p>
                    )}
                  </div>
                </div>
              )))}
            </div>
          </div>
        </>}
        {showDiscussions && <>
          <div className="container w-75 border mb-3">
            <h2 className='mt-1'>Discussion Forum</h2>

            {/* Chat window */}
            <div className="container pt-2 mx-auto border rounded-top" style={{ height: '300px', overflowY: 'auto' }}>
              {messages.length === 0 ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                  <h5>No Discussion Yet</h5>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`d-flex ${msg.username === currentUsername ? 'justify-content-end' : 'justify-content-start'} mb-2`}
                  >
                    <div className={`card ${msg.username === currentUsername ? 'bg-primary text-white' : 'bg-light'} p-2`}>
                      <small>{msg.username}</small>
                      <p className="m-0">{msg.message}</p>
                      <small className="text-muted text-end" style={{ fontSize: '0.75rem' }}>{formatMsgTime(msg.created_at)}</small>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message input and send button */}
            <form onSubmit={handleSendMessage}>
              <div className="input-group mb-3 mt-0">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Any thoughts ..."
                  value={newMessage}
                  required
                  minLength={2}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button className="btn btn-primary" type='submit'>
                  Send
                </button>
              </div>
            </form>
          </div>
        </>}
      </div >}
      {showAnswerModal && (
        <div className="modal show" tabIndex="-1" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Post an Answer for : {questions[questionIndex].question}</h5>
                <button type="button" className="btn-close" onClick={() => setShowAnswerModal(false)}></button>
              </div>
              <form onSubmit={handleAnswer}>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Answer ..."
                    value={answer}
                    minLength={10}
                    onChange={(e) => setAnswer(e.target.value)}
                    required
                  />
                </div>
                <div className="modal-footer">
                  <button type="submit" disabled={answerBtn} className="btn btn-primary">
                    Save Answer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventDetails;
