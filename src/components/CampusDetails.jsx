import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./CampusDetailsStyles.css";
import StudentInCampusCard from "./StudentInCampusCard";

const CampusDetails = ({ students, fetchAllStudents }) => {
  const { campusId } = useParams();
  const [campus, setCampus] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    imageUrl: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const fetchCampus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/campuses/${campusId}`
      );
      const campusData = response.data;
      setCampus(campusData);
      setFormData({
        name: campusData.name || '',
        address: campusData.address || '',
        description: campusData.description || '',
        imageUrl: campusData.imageUrl || ''
      });
    } catch (err) {
      setError("Failed to load campus details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampus();
  }, [campusId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    if (campus) {
      setFormData({
        name: campus.name || '',
        address: campus.address || '',
        description: campus.description || '',
        imageUrl: campus.imageUrl || ''
      });
    }
  };

  const handleSaveClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const updateUrl = `http://localhost:8080/api/campuses/${campusId}`;
      await axios.patch(updateUrl, formData);
      setIsEditing(false);
      fetchCampus();
    } catch (err) {
      if (err.response) {
        setError(`Failed to save changes: ${err.response.data.message || err.response.statusText || 'Server Error'}`);
      } else if (err.request) {
        setError("Failed to save changes: No response from server.");
      } else {
        setError(`Failed to save changes: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudentToCampus = async (event) => {
    event.preventDefault();
    if (!selectedStudentId) return;
    try {
      await axios.patch(
        `http://localhost:8080/api/students/${selectedStudentId}`,
        { campusId: campus.id }
      );
      if (fetchAllStudents) fetchAllStudents();
      fetchCampus();
      setSelectedStudentId("");
    } catch (error) {
      setError("Failed to add student to campus.");
    }
  };

  if (loading) return <div>Loading campus details...</div>;
  if (error) return <div>{error}</div>;
  if (!campus) return <div>Campus not found.</div>;

  return (
    <div className="center-container">
      <div className="campus-details-body">
        <div className="heading">
          <h1>Campus Details</h1>
        </div>
        <div className="campus-details">
          <img
            className="campus-image"
            src={formData.imageUrl || 'https://placehold.co/200x200/cccccc/000000?text=No+Image'}
            alt={formData.name}
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x200/cccccc/000000?text=Image+Error'; }}
          />
          {isEditing ? (
            <>
              <label htmlFor="name" className="input-label">Campus Name:</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Campus Name"
              />
            </>
          ) : (
            <h2>{campus.name}</h2>
          )}

          {isEditing ? (
            <>
              <label htmlFor="address" className="input-label">Address:</label>
              <input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleChange}
                className="input-field"
                placeholder="Address"
              />
            </>
          ) : (
            <p>{campus.address}</p>
          )}

          {isEditing ? (
            <>
              <label htmlFor="description" className="input-label">Description:</label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field textarea-field"
                placeholder="Description"
                rows="4"
              ></textarea>
            </>
          ) : (
            <p>{campus.description}</p>
          )}

          {isEditing && (
            <div className="input-group">
              <label htmlFor="imageUrl" className="input-label">Image URL:</label>
              <input
                type="text"
                name="imageUrl"
                id="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="input-field"
                placeholder="Image URL"
              />
            </div>
          )}
        </div>

        <div className="campus-actions">
          {!isEditing ? (
            <button onClick={handleEditClick} className="action-button edit-button">
              ✏️ Edit Campus
            </button>
          ) : (
            <>
              <button onClick={handleCancelClick} className="action-button cancel-button">
                Cancel
              </button>
              <button onClick={handleSaveClick} className="action-button save-button">
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      <div className="add-student">
        <form className="add-student-form" onSubmit={handleAddStudentToCampus}>
          <label htmlFor="add-student-drop-down">Add a New Student</label>
          <select
            id="add-student-drop-down"
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            required
          >
            <option value="">-- Choose an option --</option>
            {students &&
              students
                .filter(student => student.campusId !== campus.id)
                .map((student) => (
                  <option key={student.id} value={student.id}>
                    ID:{student.id} | Name:{student.firstName} {student.lastName}
                  </option>
                ))}
          </select>
          <button type="submit" className="action-button add-student-button">Add Student</button>
        </form>
      </div>

      <div className="students">
        <h2>Attending Students</h2>
        {campus.students && campus.students.length > 0 ? (
          campus.students.map((student) => (
            <StudentInCampusCard
              key={student.id}
              student={student}
              fetchAllStudents={fetchCampus}
              students={campus.students}
            />
          ))
        ) : (
          <p>It looks like no students have been added to this campus yet!</p>
        )}
      </div>
    </div>
  );
};

export default CampusDetails;
