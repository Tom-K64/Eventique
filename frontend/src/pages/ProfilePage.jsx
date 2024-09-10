import React, { useEffect, useState, useContext } from 'react';
import { loginContext } from '../App';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn,isPicChanged, setIsPicChanged } = useContext(loginContext);
    const [userData, setUserData] = useState({});

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
    const getData = async () => {
        if (isLoggedIn) {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BASE_URL}/userprofile/website/api/profile-details/`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("access")}`,
                        },
                    }
                );
                const data = await response.json();
                if (response.ok) {
                    setUserData(data);
                    localStorage.setItem("first_name", data?.user?.first_name);
                    if (data?.profile_pic) {
                        localStorage.setItem("profilepic", data?.profile_pic);
                    }
                    setIsPicChanged(!isPicChanged);
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
    useEffect(() => {
        getData();
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
                <h2 className="text-center mb-4">My Profile</h2>

                <div className="row">
                    {/* Left side: Profile Picture and Username */}
                    <div className="col-md-4 text-center">
                        <img
                            src={userData?.profile_pic?`${import.meta.env.VITE_BASE_URL}${userData?.profile_pic}`:"https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail.png"}
                            alt="Profile"
                            className="rounded-circle img-fluid mb-3"
                            style={{ width: '150px', height: '150px', border: '2px solid #ddd' }}
                        />
                        <h4 className="fw-bold">{userData?.user?.first_name}</h4>
                    </div>

                    {/* Right side: User Details */}
                    <div className="col-md-8">
                        <div className="row mb-3">
                            <div className="col-sm-2 fw-bold">Name:</div>
                            <div className="col-sm-3">{userData?.user?.first_name} {userData?.user?.last_name}</div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-sm-2 fw-bold">Email:</div>
                            <div className="col-sm-3">{userData?.user?.email}</div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-sm-2 fw-bold">Gender:</div>
                            <div className="col-sm-3">{userData?.gender}</div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-sm-2 fw-bold">Date of Birth:</div>
                            <div className="col-sm-3">{userData?.dob ? userData?.dob : "N/A"}</div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-sm-2 fw-bold">Biography:</div>
                            <div className="col-sm-3">{userData?.bio ? userData?.bio : "N/A"}</div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-sm-2 fw-bold">Location:</div>
                            <div className="col-sm-3">{userData?.location ? userData?.location : "N/A"}</div>
                        </div>

                        {/* Buttons for updating profile and password */}
                        <div className="mt-4">
                            <Link to="/update-profile" className="btn btn-primary me-3" >Update Profile</Link>
                            <Link to="/update-password" className="btn btn-warning" >Change Password</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
