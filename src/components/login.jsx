import React from "react";
import "./login.css";

const Login = () => {
    return (
        <div className="login-container">
            <form className="form">
                <h1>Log in</h1>
                <label className="label">
                    Username:
                    <input required className="input" type="text" name="username" />
                </label>
                <label className="label">
                    Password:
                    <input required className="input" type="password" name="password" />
                </label>
                <button className="button" type="submit">Log In</button>
            </form>
        </div>
    );
};

export default Login;