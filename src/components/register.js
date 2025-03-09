import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
const [formData, setFormData] = useState({
    email: "",
    password: "",
    user_gender: "",
    user_occupation_label: "",
    raw_user_age: "",
});
const [error, setError] = useState("");
const navigate = useNavigate();

const handleForm = (e) => {
    setFormData((prevState) => ({
    ...prevState,
    [e.target.name]: e.target.value,
    }));
};

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    await axios.post("http://127.0.0.1:5000/auth/register", formData, {
        withCredentials: true,
    });
    navigate("/auth/login");
    } catch (err) {
    setError(err.response?.data?.error || "Registration failed");
    }
};

return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
    <h2 className="text-2xl mb-4">Register</h2>
    {error && <p className="text-red-500">{error}</p>}
    <form onSubmit={handleSubmit}>
        <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleForm}
        className="w-full p-2 mb-4 border rounded"
        />
        <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleForm}
        className="w-full p-2 mb-4 border rounded"
        />
        <input
        type="number"
        name="user_gender"
        placeholder="Gender 0/1"
        value={formData.user_gender}
        onChange={handleForm}
        className="w-full p-2 mb-4 border rounded"
        />
        <input
        type="number"
        name="user_occupation_label"
        placeholder="Occupation 0-20"
        value={formData.user_occupation_label}
        onChange={handleForm}
        className="w-full p-2 mb-4 border rounded"
        />
        <input
        type="number"
        name="user_raw_age"
        placeholder="Age"
        value={formData.user_occupation_label}
        onChange={handleForm}
        className="w-full p-2 mb-4 border rounded"
        />
        <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded"
        >
        Login
        </button>
    </form>
    </div>
);
}
export default Register;
