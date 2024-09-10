import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";

const Signup = () => {
  const [otpButtonText, setOtpButtonText] = useState("Send OTP");
  const [isOtpButtonDisabled, setOtpButtonDisabled] = useState(true);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    first_name: '',
    last_name: '',
    gender: 'Male',
    email: '',
    password: '',
    confirm_password: ''
  });
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
    if (name === 'email') {
      if (emailRegex.test(value)) {
        setOtpButtonDisabled(false);
      } else {
        setOtpButtonDisabled(true);
      }
    }
  };

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const newAlert = (msg,type) =>{
    setAlertType(type);
    setAlertMessage(msg);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formValues.password != formValues.confirm_password){
      newAlert("Passwords do not match!","warning");
      return;
    }

    newAlert("Verifying OTP . . .","warning");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/user/website/api/verify-otp/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formValues.email,otp: formValues.otp }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        newAlert("OTP Verified successfully !    x", "success");
        //Create Account API Call
        setTimeout(async()=>{
          try {
            const response = await fetch(
              `${import.meta.env.VITE_BASE_URL}/user/website/api/sign-up/`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...formValues }),
              }
            );
            const data = await response.json();
            if (response.ok) {
              newAlert("Account Created successfully !    x", "success");
              setTimeout(()=>navigate("/sign-in"),1000);
            } else {
              newAlert(`${data.message.message}   x`, "danger");
            }
          } catch (e) {
            newAlert(`${e.message}   x`, "danger");
          }
        },1000);
      } else {
        newAlert(`${data.message.message}   x`, "danger");
      }
    } catch (e) {
      newAlert(`${e.message}   x`, "danger");
    }

  };
  const handleSendOtp = async () => {
    setOtpButtonDisabled(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/user/website/api/send-otp/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formValues.email }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setOtpButtonText("Resend OTP");
        setOtpButtonDisabled(true);
        setTimer(30);
        newAlert("Otp sent successfully !    x", "success");
      } else {
        setOtpButtonDisabled(false);
        newAlert(`${data.message.message}   x`, "danger");
      }
    } catch (e) {
      newAlert(`${e.message}   x`, "danger");
    }
    
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdown); // Stop the timer when it reaches 0
          setOtpButtonDisabled(false); // Re-enable the button
          setOtpButtonText("Resend OTP"); // Keep "Resend OTP" after the timer ends
          return 0;
        }
        return prevTimer - 1; // Decrease the timer by 1 each second
      });
    }, 1000); // 1000ms interval = 1 second
  };
  return (
    <>
      {showAlert && (
        <div
        className={`alert alert-${alertType} position-fixed`}
        style={{top:"100px",right:"20px",width:"auto",zIndex:"100"}}
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
                <h3 className="card-title text-center mb-4">Create Account</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="first_name"
                      value={formValues.first_name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      minLength={3}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="last_name" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="last_name"
                      name="last_name"
                      value={formValues.last_name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      minLength={3}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Gender</label>
                    <select className="form-select" name="gender" value={formValues.gender} onChange={handleChange} required>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formValues.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      required
                    />
                  </div>

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
                      minLength={8}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirm-password" className="form-label">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirm-password"
                      name="confirm_password"
                      value={formValues.confirm_password}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      minLength={8}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="otp" className="form-label">
                      One Time Password (OTP)
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        id="otp"
                        name="otp"
                        value={formValues.otp}
                        onChange={handleChange}
                        placeholder="xxxxxx"
                        minLength={6}
                        maxLength={6}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-link"
                        disabled={isOtpButtonDisabled}
                        onClick={handleSendOtp}
                      >
                        {otpButtonText} {isOtpButtonDisabled && `(${timer}s)`}
                      </button>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Sign Up
                  </button>
                </form>

                <p className="text-center mt-3">
                  Already have an account? <Link to="/sign-in">Login here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
