import React, { useEffect, useState } from "react";
import "./AddStudentStyles.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function AddStudent({ fetchAllStudents }) {
  const navigate = useNavigate();
  const [campuses, setCampuses] = useState([]);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    getCampuses();
  }, []);

  async function getCampuses() {
    try {
      const response = await axios.get("http://localhost:8080/api/campuses");
      const campusList = response.data;
      setCampuses(campusList);
    } catch (error) {
      console.error(error.message);
      setErrors(prev => [
        ...prev,
        "There was an issue retrieving campus data! You can still add the student, but without their campus.",
      ]);
    }
  }

  async function addStudent(fn, ln, email, campus, imageUrl, gpa) {
    try {
      const campusId = campus ? Number(campus) : undefined;

      await axios.post("http://localhost:8080/api/students", {
        firstName: fn,
        lastName: ln,
        email: email,
        imageUrl: imageUrl || undefined,
        campusId: campusId,
        gpa: Number(gpa),
      });

      fetchAllStudents();
      navigate("/students");
    } catch (error) {
      console.error("There was an issue adding the student: ", error.message);
      setErrors(prev => [
        ...prev,
        "Add student failed! Please make sure you input a proper email.",
      ]);
    }
  }

  function onSubmit(formData) {
    const [firstName, lastName, email, campus, imageUrl, gpa] = [
      formData.get("firstName"),
      formData.get("lastName"),
      formData.get("email"),
      formData.get("campus"),
      formData.get("imageUrl"),
      formData.get("gpa"),
    ];

    addStudent(firstName, lastName, email, campus, imageUrl, gpa);
  }

  return (
    <div className="form-body">
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          onSubmit(formData);
        }}
      >
        <h1>Add Student</h1>

        <label className="label">
          First Name:
          <input required className="input" type="text" name="firstName" />
        </label>

        <label className="label">
          Last Name:
          <input required className="input" type="text" name="lastName" />
        </label>

        <label className="label">
          Email:
          <input required className="input" type="email" name="email" />
        </label>

        <label className="label">
          Image URL:
          <input className="input" type="url" name="imageUrl" />
        </label>

        <label className="label">
          Campus (
          <span className="tooltip-container">
            <Link className="linkToCreate" to="/add-campus">?</Link>
            <div className="tooltip">Don't see your Campus listed? Click here to add it!</div>
          </span>
          ):
          <select name="campus" id="campus" className="input">
            <option value="">Choose a Campus</option>
            {campuses.map((campus) => (
              <option key={campus.id} value={campus.id}>
                {campus.name}
              </option>
            ))}
          </select>
        </label>

        <label className="label">
          GPA:
          <input
            className="input"
            type="number"
            name="gpa"
            step={0.01}
            min={0}
            max={4}
            defaultValue={0}
          />
        </label>

        <ul className="errorsList">
          {errors.map((error, index) => (
            <li className="error" key={index}>
              {error}
            </li>
          ))}
        </ul>

        <button className="button" type="submit">Add Student</button>
      </form>
    </div>
  );
}
