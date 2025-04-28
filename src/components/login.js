import axios from "axios";
import { useState, useEffect } from "react"; 
import { Link, useNavigate } from "react-router-dom";

const Login = ({ authenticated, onAuthenticated }) => {
  const errStyle = { color: "red" };
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errMessage, setErrMessage] = useState("");

  useEffect(() => {
    if (authenticated) {
      navigate("/home");
    }
  }, [authenticated, navigate]);

  const handleClick = () => {
    axios
      .post(
        `http://127.0.0.1:5000/auth/login`,
        {
          email: form.email,
          password: form.password,
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log("Login response:", response.data);
        onAuthenticated(true, {
          token: response.data.access_token,
          userId: response.data.user_id,
          role: response.data.role,
        });
        navigate("/home");
      })
      .catch((err) => {
        console.error("Error:", err.response?.data || err.message);
        setErrMessage(err.response?.data?.error || "Login failed");
      });
  };

  const handleForm = (e) => {
    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="lg-center place-content-center">
      <div className="text-center lg-center w-full bg-blue-200 pb-4 pt-4">
        <h2 className="text-4xl text-white">User Login</h2>
      </div>
      <div className="flex flex-col items-center space-y-8 mt-12">
        <input
          onChange={handleForm}
          type="text"
          name="email"
          value={form.email}
          placeholder="Email"
          className="input input-bordered w-full max-w-xs"
        />
        <input
          onChange={handleForm}
          type="password"
          name="password"
          value={form.password}
          placeholder="Password"
          className="input input-bordered w-full max-w-xs"
        />
        <button className="btn btn-active" onClick={handleClick}>
          Submit
        </button>
        <p style={errStyle}>{errMessage}</p>
        <div>
          <Link className="underline text-blue-500" to="/register">
            Don't have an account? Register here.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
