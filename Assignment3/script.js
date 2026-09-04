let students = JSON.parse(localStorage.getItem("students")) || [];

window.onload = function () {
    displayStudents();
    findTopper();
};


function addStudent() {

    let name = document.getElementById("name").value.trim();
    let roll = document.getElementById("roll").value.trim();

    let m1 = Number(document.getElementById("m1").value);
    let m2 = Number(document.getElementById("m2").value);
    let m3 = Number(document.getElementById("m3").value);
    let m4 = Number(document.getElementById("m4").value);
    let m5 = Number(document.getElementById("m5").value);

    // Check empty fields
    if (
        name === "" ||
        roll === "" ||
        document.getElementById("m1").value === "" ||
        document.getElementById("m2").value === "" ||
        document.getElementById("m3").value === "" ||
        document.getElementById("m4").value === "" ||
        document.getElementById("m5").value === ""
    ) {
        alert("Please fill all fields!");
        return;
    }

    // Calculate total
    let total = m1 + m2 + m3 + m4 + m5;

    // Calculate percentage
    let percentage = total / 5;

    // Calculate grade
    let grade;

    if (percentage >= 90) {
        grade = "A+";
    } 
    else if (percentage >= 80) {
        grade = "A";
    } 
    else if (percentage >= 70) {
        grade = "B";
    } 
    else if (percentage >= 60) {
        grade = "C";
    } 
    else if (percentage >= 50) {
        grade = "D";
    } 
    else {
        grade = "F";
    }

    // Calculate result
    let result;

    if (
        m1 >= 35 &&
        m2 >= 35 &&
        m3 >= 35 &&
        m4 >= 35 &&
        m5 >= 35
    ) {
        result = "PASS";
    } 
    else {
        result = "FAIL";
    }

    // Create student object
    let student = {
        name: name,
        roll: roll,
        total: total,
        percentage: percentage,
        grade: grade,
        result: result
    };

    // Add student
    students.push(student);

    // Save to browser
    localStorage.setItem("students", JSON.stringify(students));

    // Display
    displayStudents();
    findTopper();

    // Clear inputs
    document.getElementById("name").value = "";
    document.getElementById("roll").value = "";
    document.getElementById("m1").value = "";
    document.getElementById("m2").value = "";
    document.getElementById("m3").value = "";
    document.getElementById("m4").value = "";
    document.getElementById("m5").value = "";

    alert("Student added successfully!");
}


function displayStudents() {

    let tableBody = document.getElementById("tableBody");

    tableBody.innerHTML = "";

    students.forEach(function (student, index) {

        let row = `
            <tr>
                <td>${student.roll}</td>
                <td>${student.name}</td>
                <td>${student.total}</td>
                <td>${student.percentage.toFixed(2)}%</td>
                <td>${student.grade}</td>
                <td>${student.result}</td>
                <td>
                    <button onclick="deleteStudent(${index})">
                        Delete
                    </button>
                </td>
            </tr>
        `;

        tableBody.innerHTML += row;
    });
}


function deleteStudent(index) {

    students.splice(index, 1);

    localStorage.setItem("students", JSON.stringify(students));

    displayStudents();
    findTopper();
}


function findTopper() {

    let topper = document.getElementById("topper");

    if (students.length === 0) {
        topper.innerHTML = "";
        return;
    }

    let highest = students[0];

    for (let i = 1; i < students.length; i++) {

        if (students[i].total > highest.total) {
            highest = students[i];
        }
    }

    topper.innerHTML =
        "🏆 Topper: " +
        highest.name +
        " | Roll No: " +
        highest.roll +
        " | Percentage: " +
        highest.percentage.toFixed(2) +
        "%";
}