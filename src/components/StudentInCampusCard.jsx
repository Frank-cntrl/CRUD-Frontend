import React from "react";
import axios from "axios";
import "./StudentInCampusCardStyles.css";
import { Link } from "react-router";

const StudentCard = ({ student, fetchAllStudents }) => {
  const handleDeleteStudent = async () => {
    const confirmed = window.confirm("Are you sure you want to remove this student from the campus?");
    if (!confirmed) return;
    try {
      await axios.patch(
      `http://localhost:8080/api/students/${student.id}`,
      { campusId: null }
    );
    fetchAllStudents();
  } catch (error) {
    console.error("Error removing student from campus:", error);
  }
  };

  return (
    <div className={"student-card"}>
      <div className="student-card-header">
          <h2>{student.firstName} {student.lastName}</h2>
      </div>
      <div>
        <img
          className="student-card-image"
          src={student.imageUrl}
          alt={student.firstName}
        />
      </div>
      <div className="student-card-header-buttons">
        <Link to={`/students/${student.id}`}>
            <p>🔎View Profile</p>
        </Link>
        {student.campusId === null ? (
          <Link to={`/students/${student.id}/edit`}>
            <p>✏️Assign Campus</p>
          </Link>
          ) : (
            <div className="student-campus">
                <Link to={`/campuses/${student.campusId}`}>
                  <p>🏫View Campus</p>
                </Link>
            </div>
          )}
      </div>
      <div className = "delete-student">
        <p onClick={handleDeleteStudent}>❌</p>
      </div>
    </div>
  );
};

export default StudentCard;
