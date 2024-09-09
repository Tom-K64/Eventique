import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/LoginPage';
import Signup from './pages/SignupPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Profile from './pages/ProfilePage';
import UpdateProfile from './pages/UpdateProfilePage';
import UpdatePassword from './pages/UpdatePasswordPage';
import EventCreation from './pages/CreateEvent';
import UpdateEvent from './pages/UpdateEvent';
import EventDetails from './pages/EventDetailPage';
import MyEvents from './pages/MyEventsPage';
import MyBoookings from './pages/MyBookingsPage';
import NotFound from './components/NotFound';
import AllEvents from './pages/AllEventsPage';
export const loginContext = createContext();

function App() {
  const [auth, setAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPicChanged, setIsPicChanged] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("is_authenticated")) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate("/");
    }
  }, [auth]);

  return (
    <loginContext.Provider value={{ isLoggedIn, setIsLoggedIn, auth, setAuth,isPicChanged,setIsPicChanged,isSearch, setIsSearch }}>
      <Navbar isPicChanged={isPicChanged} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/update-profile" element={<UpdateProfile/>} />
        <Route path="/update-password" element={<UpdatePassword/>} />
        <Route path="/event/:id" element={<EventDetails/>} />
        <Route path="/events" element={<AllEvents/>} />
        <Route path="/my-events" element={<MyEvents/>} />
        <Route path="/create-event" element={<EventCreation/>} />
        <Route path="/update-event/:id" element={<UpdateEvent/>} />
        <Route path="/my-bookings" element={<MyBoookings/>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </loginContext.Provider>
  );
}

export default App;
