import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./EditStudentStyles.css";

const StudentDetails = () => {
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        imageUrl: '',
        gpa: '',
        campusId: null
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [campusesLoading, setCampusesLoading] = useState(true);
    const [error, setError] = useState(null);
    const [campusesList, setCampusesList] = useState([]);

    const fetchStudent = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                `http://localhost:8080/api/students/${studentId}`
            );
            const studentData = response.data;
            setStudent(studentData);
            setFormData({
                firstName: studentData.firstName || '',
                lastName: studentData.lastName || '',
                email: studentData.email || '',
                imageUrl: studentData.imageUrl || '',
                gpa: studentData.gpa || '',
                campusId: studentData.campusId || null
            });
        } catch (err) {
            setError("Failed to load student details.");
        } finally {
            setLoading(false);
        }
    };

    const fetchAllCampuses = async () => {
        setCampusesLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/campuses');
            setCampusesList(response.data);
        } catch (err) {
        } finally {
            setCampusesLoading(false);
        }
    };

    useEffect(() => {
        fetchStudent();
    }, [studentId]);

    useEffect(() => {
        fetchAllCampuses();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === 'campusId') {
            newValue = (value === 'null' || value === '') ? null : parseInt(value, 10);
        }

        setFormData(prevData => ({
            ...prevData,
            [name]: newValue
        }));
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        if (student) {
            setFormData({
                firstName: student.firstName || '',
                lastName: student.lastName || '',
                email: student.email || '',
                imageUrl: student.imageUrl || '',
                gpa: student.gpa || '',
                campusId: student.campusId || null
            });
        }
    };

    const handleSaveClick = async () => {
        setLoading(true);
        setError(null);
        try {
            const updateUrl = `http://localhost:8080/api/students/${studentId}`;
            await axios.patch(updateUrl, formData);
            setIsEditing(false);
            fetchStudent();
        } catch (err) {
            if (err.response) {
                if (err.response.status === 404) {
                    setError("Failed to save changes: Student not found or API endpoint incorrect.");
                } else if (err.response.status === 405) {
                    setError("Failed to save changes: Method not allowed. API might not support PATCH either.");
                } else {
                    setError(`Failed to save changes: ${err.response.data.message || err.response.statusText || 'Server Error'}`);
                }
            } else if (err.request) {
                setError("Failed to save changes: No response from server.");
            } else {
                setError(`Failed to save changes: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading || campusesLoading) return <div>Loading student details and campuses...</div>;
    if (error) return <div>{error}</div>;
    if (!student) return <div>Student not found.</div>;

    return (
        <div className="center-container">
            <div className="student-details-body">
                <div className="heading">
                    <h1>Student Details</h1>
                </div>
                <div>
                    <img
                        className="student-image"
                        src={formData.imageUrl || 'https://placehold.co/200x200/cccccc/000000?text=No+Image'}
                        alt={`${formData.firstName} ${formData.lastName}`}
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x200/cccccc/000000?text=Image+Error'; }}
                    />
                    {isEditing ? (
                        <>
                            <label htmlFor="firstName" className="input-label">First Name:</label>
                            <input
                                type="text"
                                name="firstName"
                                id="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="First Name"
                            />
                            <label htmlFor="lastName" className="input-label">Last Name:</label>
                            <input
                                type="text"
                                name="lastName"
                                id="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Last Name"
                            />
                        </>
                    ) : (
                        <h2>{`${student.firstName} ${student.lastName}`}</h2>
                    )}

                    {isEditing ? (
                        <>
                            <label htmlFor="gpa" className="input-label">GPA:</label>
                            <input
                                type="number"
                                name="gpa"
                                id="gpa"
                                value={formData.gpa}
                                onChange={handleChange}
                                step="0.01"
                                min="0.00"
                                max="4.00"
                                className="input-field"
                                placeholder="GPA"
                            />
                        </>
                    ) : (
                        <p>GPA: {student.gpa}</p>
                    )}

                    {isEditing ? (
                        <>
                            <label htmlFor="email" className="input-label">E-mail:</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Email"
                            />
                        </>
                    ) : (
                        <p>E-mail: {student.email}</p>
                    )}

                    {isEditing && (
                        <div > {}
                            <label htmlFor="imageUrl" >Image URL:</label> {}
                            <input
                                type="text"
                                id="imageUrl"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Image URL"
                            />
                        </div>
                    )}
                </div>

                <div>
                    {isEditing ? (
                        <div > {/* Removed flex and mt-4 */}
                            <label htmlFor="campusId" >Assign Campus:</label> {/* Removed text-sm font-semibold mb-1 */}
                            <select
                                id="campusId"
                                name="campusId"
                                value={formData.campusId || 'null'}
                                onChange={handleChange}
                                className="input-field p-2 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="null">-- Unassign Campus --</option>
                                {campusesList.map(campus => (
                                    <option key={campus.id} value={campus.id}>
                                        {campus.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        student.campusId === null ? (
                            <p>It looks like this student is not assigned to a campus yet!</p>
                        ) : (
                            <div className="student-campus">
                                <p>
                                    Campus:{" "}
                                    {student.campus ? (
                                        <Link to={`/campuses/${student.campus.id}`}>
                                            {student.campus.name}
                                        </Link>
                                    ) : (
                                        "N/A"
                                    )}
                                </p>
                            </div>
                        )
                    )}
                </div>

                <div className="student-actions">
                    {!isEditing ? (
                        <button onClick={handleEditClick} className="action-button edit-button">
                            ✏️ Edit
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
        </div>
    );
};

export default StudentDetails;
