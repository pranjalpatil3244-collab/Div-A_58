import { useState } from "react";
import StudentInformation from "./StudentInformation";
import StudentList from "./StudentList";

function App() {
  const [students, setStudents] = useState([]);

  const addStudent = (student) => {
    setStudents([...students, student]);
  };

  return (
    <>
      <StudentInformation addStudent={addStudent} />
      <StudentList students={students} />
    </>
  );
}

export default App;