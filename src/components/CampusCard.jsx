import React from "react";
import axios from "axios";
import "./CampusCardStyles.css";
import { Link } from "react-router-dom";

const CampusCard = ({ campus, fetchAllCampuses, students }) => {
  const handleDeleteCampus = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this campus?");
    if (!confirmed) return;
    try {
      await axios.delete(`http://localhost:8080/api/campuses/${campus.id}`);
      fetchAllCampuses();
    } catch (error) {
      console.error("Error deleting campus:", error);
    }
  };

  const studentCounter = (campus, students) => {
    return students.filter(student => student.campusId === campus.id).length;
  };

  return (
    <div className="campus-card">
      <div className="campus-card-header">
        <h2>{campus.name}</h2>
      </div>

      <div>
        <img className="campus-card-image" src={campus.imageUrl} alt={campus.name} />
      </div>

      <div className="campus-card-count">
        <p>{studentCounter(campus, students)} Students</p>
      </div>

      <div className="campus-card-links">
        <Link to={`/campuses/${campus.id}`} className="card-link">
          View Campus
        </Link>

        <button className="card-link delete-button" onClick={handleDeleteCampus}>
          Delete Campus
        </button>
      </div>
    </div>
  );
};

export default CampusCard;
