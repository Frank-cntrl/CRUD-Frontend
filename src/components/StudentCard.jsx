import React from "react";
import axios from "axios";
import "./StudentCardStyles.css";
import { Link } from "react-router-dom";

const StudentCard = ({ student, fetchAllStudents }) => {
  const handleDeleteStudent = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this student?");
    if (!confirmed) return;
    try {
      await axios.delete(`http://localhost:8080/api/students/${student.id}`);
      fetchAllStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <div className="student-card">
      <div className="student-card-header">
        <h2>{student.firstName} {student.lastName}</h2>
      </div>

      <div>
        <img className="student-card-image" src={student.imageUrl} alt={student.firstName} />
      </div>

      <div className="student-card-links">
        <Link to={`/students/${student.id}`} className="card-link">
          View Profile
        </Link>

        {student.campusId === null ? (
          <Link to={`/students/${student.id}/edit`} className="card-link">
            Assign Campus
          </Link>
        ) : (
          <Link to={`/campuses/${student.campusId}`} className="card-link">
            View Campus
          </Link>
        )}

        <button className="card-link delete-button" onClick={handleDeleteStudent}>
          Delete Student
        </button>
      </div>
    </div>
  );
};

export default StudentCard;
