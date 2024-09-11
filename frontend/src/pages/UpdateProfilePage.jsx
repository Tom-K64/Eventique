import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginContext } from '../App';

const UpdateProfile = () => {
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn } = useContext(loginContext);

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
                            "Content-Type": "multipart/form-data",
                            Authorization: `Bearer ${localStorage.getItem("access")}`,
                        },
                    }
                );
                const data = await response.json();
                if (response.ok) {
                    setFormData({
                        first_name: data.user.first_name,
                        last_name: data.user.last_name,
                        profile_pic: data?.profile_pic?`${import.meta.env.VITE_BASE_URL}${data?.profile_pic}`:null,
                        bio: data.bio,
                        dob: data.dob,
                        location: data.location,
                        gender: data.gender ? data.gender : 'Male',
                        pic_uploaded: false
                    });
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

    // State to handle form data
    const [formData, setFormData] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);

    // Handle input change
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle image change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            setFormData({
                ...formData,
                profile_pic: file, pic_uploaded: true,
            });
        }
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const putFormData = new FormData();
            Object.keys(formData).forEach((key) => {
                putFormData.append(key, formData[key]);
            });
            const response = await fetch(
                `${import.meta.env.VITE_BASE_URL}/userprofile/website/api/update-profile/`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`,
                    },
                    body: putFormData
                }
            );
            const data = await response.json();
            if (response.ok) {
                navigate("/profile");
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
    function formatDateToInput(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }

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
                <h2 className="text-center mb-4">Update Profile</h2>

                <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
                    {/* Profile Picture */}
                    <label htmlFor="profileImage">
                        <img
                            src={selectedImage || (formData?.profile_pic ? `${formData?.profile_pic}`:"https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail.png")}
                            alt="Profile"
                            className="rounded-circle img-fluid mb-3"
                            style={{ width: '150px', height: '150px', cursor: 'pointer', border: '2px solid #ddd' }}
                        />
                    </label>
                    <input
                        type="file"
                        id="profileImage"
                        name="profile_pic"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                    />

                    {/* Editable Fields */}
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label">First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="first_name"
                                value={formData?.first_name}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="last_name"
                                value={formData?.last_name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Gender</label>
                            <select
                                className="form-select"
                                name="gender"
                                value={formData?.gender}
                                onChange={handleInputChange}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Date of Birth</label>
                            <input
                                type="date"
                                className="form-control"
                                name="dob"
                                value={formData.dob ? formatDateToInput(formData.dob) : ''}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Biography</label>
                            <input
                                type="text"
                                className="form-control"
                                name="bio"
                                value={formData?.bio}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Location</label>
                            <input
                                type="text"
                                className="form-control"
                                name="location"
                                value={formData?.location}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="btn btn-primary mt-3">Save Changes</button>
                </form>
            </div>
        </>
    );
};

export default UpdateProfile;
