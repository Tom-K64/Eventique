import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({ email: '', password: '' });

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

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/user/website/api/sign-in/`,
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
        newAlert("Login successfully !    x", "success");
        //Setup localstorage
        console.log(data);
        localStorage.setItem("first_name", data?.user?.first_name);
        localStorage.setItem("profilepic", data?.user?.profile_pic);
        localStorage.setItem("refresh", data?.refresh);
        localStorage.setItem("access", data?.access);
        localStorage.setItem("is_authenticated", 1);

        navigate("/");
      } else {
        console.log(data);
        newAlert(`${data?.message}   x`, "danger");
      }
    } catch (e) {
      console.error(e);
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
      <Navbar />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title text-center mb-4">Login</h3>

                <form onSubmit={handleSubmit}>
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
                      placeholder="Enter email or username"
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
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100">
                    Sign In
                  </button>
                </form>

                <p className="text-center mt-3">
                  Don't have an account? <Link to="/sign-up">Sign up here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
