import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./StudentDetailsStyles.css";

const StudentDetails = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);

  const fetchStudent = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/students/${studentId}`
      );
      setStudent(response.data);
    } catch (error) {
      console.error("Error fetching student:", error);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [studentId]);

  if (!student) return <div>Loading...</div>;

  return (
    <div className="center-container">
      <div className="student-details-body">
        <div className="heading">
          <h1>Student Details</h1>
        </div>
        <div>
          <img
            className="student-image"
            src={student.imageUrl}
            alt={student.name}
          />
          <h2>{`${student.firstName} ${student.lastName}`}</h2>
          <p>GPA: {student.gpa}</p>
          <p>E-mail: {student.email}</p>
        </div>
        <div>
          {student.campusId === null ? (
            <p>It looks like this student is not assigned to a campus yet!</p>
          ) : (
            <div className="student-campus">
              <p>
                Campus:{" "}
                <Link to={`/campuses/${student.campus.id}`}>
                  {student.campus.name}
                </Link>
              </p>
            </div>
          )}
        </div>
        <div className="edit-button">
          <Link to={`/students/${student.id}/edit`}>
            <p>✏️ Edit</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
