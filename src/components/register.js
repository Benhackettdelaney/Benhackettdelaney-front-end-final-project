import axios from "axios";
import { useState, useEffect } from "react"; 
import { Link, useNavigate } from "react-router-dom";

const Register = ({ authenticated, onAuthenticated }) => {
  const errStyle = { color: "red" };
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    user_gender: "",
    user_occupation_label: "",
    raw_user_age: "",
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
        `http://127.0.0.1:5000/auth/register`,
        {
          username: form.username,
          email: form.email,
          password: form.password,
          user_gender: parseInt(form.user_gender),
          user_occupation_label: parseInt(form.user_occupation_label),
          raw_user_age: parseInt(form.raw_user_age),
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log("Registration response:", response.data);
        const authData = {
          token: response.data.access_token,
          userId: response.data.user_id,
          role: "user",
        };
        onAuthenticated(true, authData);
        navigate("/home");
      })
      .catch((err) => {
        console.error("Error:", err.response?.data || err.message);
        setErrMessage(err.response?.data?.error || "Registration failed");
      });
  };

  const handleForm = (e) => {
    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="lg-center container place-content-center">
      <div className="text-center lg-center cover-full bg-blue-200 pb-4 pt-4">
        <h2 className="text-4xl text-white">User Register</h2>
      </div>
      <div className="flex flex-col items-center space-y-8 mt-12">
        <input
          onChange={handleForm}
          type="text"
          name="username"
          value={form.username}
          placeholder="Username"
          className="input input-bordered w-full max-w-xs"
          required
        />
        <input
          onChange={handleForm}
          type="text"
          name="email"
          value={form.email}
          placeholder="Email"
          className="input input-bordered w-full max-w-xs"
          required
        />
        <input
          onChange={handleForm}
          type="password"
          name="password"
          value={form.password}
          placeholder="Password (min 8 chars)"
          className="input input-bordered w-full max-w-xs"
          required
        />
        <input
          onChange={handleForm}
          type="number"
          name="user_gender"
          value={form.user_gender}
          placeholder="Gender (0 or 1)"
          className="input input-bordered w-full max-w-xs"
          required
        />
        <input
          onChange={handleForm}
          type="number"
          name="user_occupation_label"
          value={form.user_occupation_label}
          placeholder="Occupation Label (e.g., 1)"
          className="input input-bordered w-full max-w-xs"
          required
        />
        <input
          onChange={handleForm}
          type="number"
          name="raw_user_age"
          value={form.raw_user_age}
          placeholder="Age (e.g., 25)"
          className="input input-bordered w-full max-w-xs"
          required
        />
        <button className="btn btn-active" onClick={handleClick}>
          Submit
        </button>
        <p style={errStyle}>{errMessage}</p>
        <div>
          <Link className="underline text-blue-500" to="/">
            Have an account? Login here.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
