import React from "react";
import "./login.css";

const Signup = () => {
    return (
        <div className="signup-container">
            <form className="form">
                <h1>Sign Up</h1>
                <label className="label">
                    First Name:
                    <input required className="input" type="text" name="firstName" />
                </label>
                <label className="label">
                    Last Name:
                    <input required className="input" type="text" name="lastName" />
                </label>
                <label className="label">
                    E-mail Address:
                    <input required className="input" type="email" name="email" />
                </label>
                <label className="label">
                    Username:
                    <input required className="input" type="text" name="username" />
                </label>
                <label className="label">
                    Password:
                    <input required className="input" type="password" name="password" />
                </label>
                <button className="button" type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;