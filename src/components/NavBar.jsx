import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "./NavBarStyles.css";

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkLoginStatus = async () => {
    try {
      const response = await axios.get('http://localhost:8080/auth/me', {
        withCredentials: true
      });
      
      setIsLoggedIn(true);
      setUser(response.data.user);
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return { isLoggedIn, user, loading, checkLoginStatus };
};

const NavBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    navigate(`/search?query=${encodeURIComponent(trimmed)}`);
    setSearchTerm("");
  };

  const { isLoggedIn, user, loading, checkLoginStatus } = useAuth();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/auth/logout', {}, {
        withCredentials: true
      });
      checkLoginStatus();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) return <div>loading...</div>;

  return (
    <nav className="navbar">

      <NavLink to="/">Home</NavLink>
      <NavLink to="/campuses">Campuses</NavLink>
      <NavLink to="/students">Students</NavLink>
      <NavLink to="/faculty">Faculty</NavLink>
      <NavLink to="/contact">Contact Us</NavLink>
      <div className="logcheck">
      {isLoggedIn ? (
        <>
          <span>Welcome, {user?.username}!</span>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </>
      ):(
        <>
          <NavLink to="/login" className="login-button">Login</NavLink>
          <NavLink to="/signup">Sign Up</NavLink>
        </>
      )}
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </form>

    </nav>
  );
};

export default NavBar;

