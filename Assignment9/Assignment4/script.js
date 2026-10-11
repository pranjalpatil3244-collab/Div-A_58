const employeeForm = document.getElementById("employeeForm");

const employeeTableBody =
    document.getElementById("employeeTableBody");

const noEmployee =
    document.getElementById("noEmployee");


// Form Submit

employeeForm.addEventListener("submit", function(event) {

    event.preventDefault();


    // Get values

    const firstName =
        document.getElementById("firstName").value;

    const lastName =
        document.getElementById("lastName").value;

    const email =
        document.getElementById("email").value;

    const phone =
        document.getElementById("phone").value;

    const dob =
        document.getElementById("dob").value;

    const gender =
        document.getElementById("gender").value;

    const department =
        document.getElementById("department").value;

    const position =
        document.getElementById("position").value;

    const salary =
        document.getElementById("salary").value;

    const joiningDate =
        document.getElementById("joiningDate").value;

    const address =
        document.getElementById("address").value;


    // Create Employee Object

    const employee = {

        firstName: firstName,

        lastName: lastName,

        email: email,

        phone: phone,

        dob: dob,

        gender: gender,

        department: department,

        position: position,

        salary: salary,

        joiningDate: joiningDate,

        address: address

    };


    // Console

    console.log("Employee Data:", employee);


    // Create Table Row

    const row = document.createElement("tr");


    row.innerHTML = `

        <td>${firstName} ${lastName}</td>

        <td>${email}</td>

        <td>${phone}</td>

        <td>${department}</td>

        <td>${position}</td>

        <td>₹${salary}</td>

        <td>
            <button
                class="delete-btn"
                onclick="deleteEmployee(this)">
                Delete
            </button>
        </td>

    `;


    // Add row to table

    employeeTableBody.appendChild(row);


    // Hide "No employees" message

    noEmployee.style.display = "none";


    // Success Message

    alert("Employee added successfully!");


    // Reset Form

    employeeForm.reset();

});


// Delete Employee

function deleteEmployee(button) {

    const row = button.parentElement.parentElement;

    row.remove();


    // Show message if no employees remain

    if (employeeTableBody.children.length === 0) {

        noEmployee.style.display = "block";

    }

}