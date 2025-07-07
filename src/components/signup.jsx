import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                "http://localhost:8080/auth/signup",
                formData,
                { withCredentials: true }
            );

            console.log("Signup successful:", response.data);
            // Redirect to home page or dashboard after successful signup
            navigate("/");
        } catch (error) {
            console.error("Signup error:", error);
            setError(
                error.response?.data?.error || "An error occurred during signup"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <form className="form" onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
                {error && <div className="error-message">{error}</div>}
                <label className="label">
                    Username:
                    <input 
                        required 
                        className="input" 
                        type="text" 
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </label>
                <label className="label">
                    Password:
                    <input 
                        required 
                        className="input" 
                        type="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        minLength="6"
                    />
                </label>
                <button 
                    className="button" 
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Signing Up..." : "Sign Up"}
                </button>
            </form>
        </div>
    );
};

export default Signup;
