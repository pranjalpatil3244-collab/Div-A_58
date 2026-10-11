import React from "react";

function StudentList({ students }) {
  return (
    <div
      style={{
        width: "600px",
        margin: "30px auto",
        fontFamily: "Arial"
      }}
    >
      <h2>Student List</h2>

      {students.length === 0 ? (
        <p>No students added yet.</p>
      ) : (
        students.map((student, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "6px",
              backgroundColor: "#fff"
            }}
          >
            <p>
              <b>Name:</b> {student.name}
            </p>

            <p>
              <b>Course:</b> {student.course}
            </p>

            <p>
              <b>Class:</b> {student.studentClass}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default StudentList;