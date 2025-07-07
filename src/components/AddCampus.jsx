import React from "react";
import axios from "axios";
import "./AddCampusStyles.css";

export default function AddCampus() {
  async function addCampus(c, add, imgUrl, desc) {
    try {
      await axios.post("localhost:8080/api/campuses", {
        name: c,
        address: add,
        imageUrl: imgUrl || undefined,
        description: desc,
      });
      alert("Campus added successfully!");
    } catch (error) {
      console.error(error.message);
      alert("Failed to add campus. Please try again.");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const campus = formData.get("campusName");
    const address = formData.get("address");
    const imageUrl = formData.get("imageUrl");
    const description = formData.get("description");

    addCampus(campus, address, imageUrl, description);
    e.target.reset();
  }

  return (
    <div className="add-campus-wrapper">
      <form className="form" onSubmit={handleSubmit} noValidate>
        <h1 className="form-title">Add Campus</h1>

        <label className="label">
          Campus Name
          <input
            required
            className="input"
            type="text"
            name="campusName"
            autoComplete="off"
          />
        </label>

        <label className="label">
          Address
          <input
            required
            className="input"
            type="text"
            name="address"
            autoComplete="off"
          />
        </label>

        <label className="label">
          Image URL
          <input
            className="input"
            type="url"
            name="imageUrl"
            autoComplete="off"
          />
        </label>

        <label className="label">
          Description
          <textarea
            className="input textarea"
            name="description"
            rows={4}
            spellCheck="false"
          ></textarea>
        </label>

        <button className="button" type="submit">
          Add Campus
        </button>
      </form>
    </div>
  );
}
