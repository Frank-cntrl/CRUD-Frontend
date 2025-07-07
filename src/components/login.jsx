import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
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
                "http://localhost:8080/auth/login",
                formData,
                { withCredentials: true }
            );

            console.log("Login successful:", response.data);
            navigate("/");
        } catch (error) {
            console.error("Login error:", error);
            setError(
                error.response?.data?.error || "An error occurred during login"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="form" onSubmit={handleSubmit}>
                <h1>Log in</h1>
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
                    />
                </label>
                <button 
                    className="button" 
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Logging In..." : "Log In"}
                </button>
            </form>
        </div>
    );
};

export default Login;
