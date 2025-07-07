import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./NavBarStyles.css";

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

  return (
    <nav className="navbar">

      <NavLink to="/">Home</NavLink>
      <NavLink to="/campuses">Campuses</NavLink>
      <NavLink to="/students">Students</NavLink>
      <NavLink to="/faculty">Faculty</NavLink>
      <NavLink to="/contact">Contact Us</NavLink>
      <NavLink to="/login">Log In</NavLink>
      <NavLink to="/signup">Sign Up</NavLink>



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

