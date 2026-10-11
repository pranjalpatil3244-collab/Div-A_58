import React, { useState } from "react";

function StudentInformation({ addStudent }) {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [studentClass, setStudentClass] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newStudent = {
      name: name,
      course: course,
      studentClass: studentClass
    };

    addStudent(newStudent);

    // Form clear
    setName("");
    setCourse("");
    setStudentClass("");
  };

  return (
    <div
      style={{
        width: "400px",
        margin: "30px auto",
        padding: "25px",
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontFamily: "Arial"
      }}
    >
      <h1>Student Information</h1>

      <form onSubmit={handleSubmit}>

        <label>Student Name</label>
        <input
          type="text"
          value={name}
          placeholder="Enter student name"
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            margin: "8px 0 15px",
            boxSizing: "border-box"
          }}
        />

        <label>Course Name</label>
        <input
          type="text"
          value={course}
          placeholder="Enter course name"
          onChange={(e) => setCourse(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            margin: "8px 0 15px",
            boxSizing: "border-box"
          }}
        />

        <label>Class</label>
        <input
          type="text"
          value={studentClass}
          placeholder="Enter class"
          onChange={(e) => setStudentClass(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            margin: "8px 0 20px",
            boxSizing: "border-box"
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#2563c7",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Add Student
        </button>

      </form>
    </div>
  );
}

export default StudentInformation;