const employeeForm = document.getElementById("employeeForm");

employeeForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const department = document.getElementById("department").value;
    const position = document.getElementById("position").value;
    const salary = document.getElementById("salary").value;

    const employee = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        department: department,
        position: position,
        salary: salary
    };

    console.log("Employee Data:", employee);

    alert("Employee added successfully!");

    employeeForm.reset();
});