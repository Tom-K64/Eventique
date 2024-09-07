import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const UpdatePassword = () => {
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState({ password: '', new_password: '', confirm_new_password: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formValues.new_password != formValues.confirm_new_password) {
            newAlert("New Passwords do not match!", "warning");
            return
        }
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BASE_URL}/user/website/api/update-password/`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ...formValues }),
                }
            );
            const data = await response.json();
            if (response.ok) {
                newAlert("Password Changed successfully !    x", "success");
                setTimeout(() => {
                    navigate("/profile");
                }, 1000);
            } else {
                newAlert(`${data?.message}   x`, "danger");
            }
        } catch (e) {
            newAlert(`Server not responding..   x`, "warning");
        }
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
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h3 className="card-title text-center mb-4">Change Password</h3>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            value={formValues.password}
                                            onChange={handleChange}
                                            placeholder="Enter password"
                                            minLength={6}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="new_password" className="form-label">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="new_password"
                                            name="new_password"
                                            value={formValues.new_password}
                                            onChange={handleChange}
                                            placeholder="Enter new password"
                                            minLength={6}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="confirm_new_password" className="form-label">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="confirm_new_password"
                                            name="confirm_new_password"
                                            value={formValues.confirm_new_password}
                                            onChange={handleChange}
                                            placeholder="Re-enter new password"
                                            minLength={6}
                                            required
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100">
                                        Update Password
                                    </button>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdatePassword;
