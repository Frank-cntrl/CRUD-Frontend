import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import "./AppStyles.css";
import NavBar from "./components/NavBar";
import LandingPage from "./components/LandingPage";
import AllCampuses from "./components/AllCampuses";
import CampusDetails from "./components/CampusDetails";
import AllStudents from "./components/AllStudents";
import StudentDetails from "./components/StudentDetails";
import AddStudent from "./components/AddStudent";
import AddCampus from "./components/AddCampus";
import EditStudent from "./components/EditStudent";
//import EditCampus from "./components/EditCampus";
import Footer from "./components/Footer";
import SearchResults from "./components/SearchResults";
import Faculty from "./components/Faculty";
import Login from "./components/login";
import Signup from "./components/signup";


const App = () => {
  const [students, setStudents] = useState([]);
  const [campuses, setCampuses] = useState([]);

  async function fetchAllStudents() {
    try {
      const response = await axios.get("https://crud-backend-gilt.vercel.app/api/students/");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  }

  async function fetchAllCampuses() {
    try {
      const response = await axios.get("https://crud-backend-gilt.vercel.app/api/campuses");
      setCampuses(response.data);
    } catch (error) {
      console.error("Error fetching campuses:", error);
    }
  }

  useEffect(() => {
    fetchAllStudents();
    fetchAllCampuses();
  }, []);

  return (
    <div className="app-container">
      <NavBar />
      <div className="content">
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route
            path="/campuses"
            element={
              <AllCampuses
                campuses={campuses}
                fetchAllCampuses={fetchAllCampuses}
                students={students}
              />
            }
          />

          <Route
            path="/campuses/:campusId"
            element={
              <CampusDetails
                campuses={campuses}
                fetchAllCampuses={fetchAllCampuses}
                students={students}
                fetchAllStudents={fetchAllStudents}
              />
            }
          />

          <Route
            path="/students"
            element={
              <AllStudents
                students={students}
                fetchAllStudents={fetchAllStudents}
              />
            }
          />

          <Route path="/students/:studentId" element={<EditStudent />} />

          <Route
            path="/add-student"
            element={<AddStudent fetchAllStudents={fetchAllStudents} />}
          />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/add-campus"
            element={<AddCampus fetchAllCampuses={fetchAllCampuses} />}
          />

          <Route
            path="/search"
            element={
              <SearchResults
                students={students}
                campuses={campuses}
                fetchAllStudents={fetchAllStudents}
                fetchAllCampuses={fetchAllCampuses}
              />
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(
  <Router>
    <App />
  </Router>
);


