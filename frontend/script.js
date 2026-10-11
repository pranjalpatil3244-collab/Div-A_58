const API = "/api";

let students = [];
let rooms = [];
let allocationData = null;


// ===============================
// PAGE NAVIGATION
// ===============================

function showSection(sectionId, clickedButton) {

    document.querySelectorAll(".page-section").forEach(section => {
        section.classList.remove("active");
    });

    const section = document.getElementById(sectionId);

    if (section) {
        section.classList.add("active");
    }

    document.querySelectorAll(".nav-item").forEach(button => {
        button.classList.remove("active");
    });

    if (clickedButton) {
        clickedButton.classList.add("active");
    } else {

        document.querySelectorAll(".nav-item").forEach(button => {

            const onclickValue = button.getAttribute("onclick");

            if (
                onclickValue &&
                onclickValue.includes(`'${sectionId}'`)
            ) {
                button.classList.add("active");
            }

        });
    }

    const titles = {
        dashboard: "Dashboard",
        students: "Exam Students",
        rooms: "Examination Rooms",
        seating: "Seating Plan",
        search: "Find Student Seat"
    };

    const pageTitle = document.getElementById("pageTitle");

    if (pageTitle) {
        pageTitle.textContent =
            titles[sectionId] || "Dashboard";
    }
}
// ===============================
// DATE
// ===============================

function setCurrentDate() {
    const date = new Date();

    const formatted = date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
    const dateElement =
        document.getElementById("currentDate");

    if (dateElement) {
        dateElement.textContent = formatted;
    }
}


// ===============================
// TOAST NOTIFICATIONS
// ===============================

function showToast(message, type = "success") {

    let container =
        document.getElementById("toastContainer");

    // Create container automatically if not present
    if (!container) {

        container =
            document.createElement("div");

        container.id = "toastContainer";

        container.className =
            "toast-container";

        document.body.appendChild(container);
    }


    const toast =
        document.createElement("div");

    toast.className =
        `toast toast-${type}`;


    const icons = {
        success: "✓",
        error: "!",
        info: "i",
        warning: "⚠"
    };


    const titles = {
        success: "Success",
        error: "Error",
        info: "Information",
        warning: "Warning"
    };


    toast.innerHTML = `

        <div class="toast-icon">
            ${icons[type] || "✓"}
        </div>

        <div class="toast-content">

            <strong>
                ${titles[type] || "Success"}
            </strong>

            <span>
                ${escapeHTML(message)}
            </span>

        </div>

        <button
            class="toast-close"
            aria-label="Close notification"
        >
            ×
        </button>

    `;


    const closeButton =
        toast.querySelector(".toast-close");


    closeButton.addEventListener("click", () => {

        removeToast(toast);

    });


    container.appendChild(toast);


    // Small delay for animation
    requestAnimationFrame(() => {
        toast.classList.add("show");
    });


    // Automatically remove
    setTimeout(() => {

        removeToast(toast);

    }, 3500);
}


// ===============================
// REMOVE TOAST
// ===============================

function removeToast(toast) {

    if (!toast || !toast.parentElement) {
        return;
    }

    toast.classList.remove("show");

    toast.classList.add("hide");


    setTimeout(() => {

        if (toast.parentElement) {
            toast.remove();
        }

    }, 300);
}


// ===============================
// LOAD DASHBOARD DATA
// ===============================

async function loadDashboard() {

    try {

        const studentResponse =
            await fetch(`${API}/students`);


        if (!studentResponse.ok) {
            throw new Error("Unable to load students");
        }


        students =
            await studentResponse.json();


        const roomResponse =
            await fetch(`${API}/rooms`);


        if (!roomResponse.ok) {
            throw new Error("Unable to load rooms");
        }


        rooms =
            await roomResponse.json();


        document.getElementById("studentCount").textContent =
            students.length;


        document.getElementById("roomCount").textContent =
            rooms.length;


        document.getElementById("allocatedCount").textContent =
            "0";


        document.getElementById("unallocatedCount").textContent =
            "0";


        renderStudents();

        renderRooms();


    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

        showToast(
            "Unable to load dashboard data.",
            "error"
        );
    }
}


// ===============================
// STUDENTS
// ===============================

async function loadStudents() {

    try {

        const response =
            await fetch(`${API}/students`);


        if (!response.ok) {
            throw new Error("Unable to load students");
        }


        students =
            await response.json();


        document.getElementById("studentCount").textContent =
            students.length;


        renderStudents();


    } catch (error) {

        console.error(
            "Student loading error:",
            error
        );

        showToast(
            "Unable to load students.",
            "error"
        );
    }
}


// ===============================
// RENDER STUDENTS
// ===============================

function renderStudents() {

    const tbody =
        document.getElementById("studentTableBody");


    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    if (students.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:40px;
                    "
                >

                    <div
                        style="
                            font-size:30px;
                            margin-bottom:10px;
                        "
                    >
                        ♙
                    </div>

                    <strong>
                        No students registered
                    </strong>

                    <div
                        style="
                            margin-top:6px;
                            color:#718096;
                        "
                    >
                        Add students to begin examination management.
                    </div>

                </td>

            </tr>

        `;

        return;
    }


    students.forEach(student => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <div
                    style="
                        display:flex;
                        align-items:center;
                        gap:10px;
                    "
                >

                    <div
                        class="student-avatar"
                    >
                        ${getInitials(student.name)}
                    </div>

                    <strong>
                        ${escapeHTML(student.name)}
                    </strong>

                </div>

            </td>


            <td>
                <span class="roll-badge">
                    ${escapeHTML(student.rollNumber)}
                </span>
            </td>


            <td>
                ${escapeHTML(student.department)}
            </td>


            <td>
                ${escapeHTML(student.subject)}
            </td>


            <td>

                <button
                    class="action-btn"
                    onclick="deleteStudent('${student._id}')"
                >
                    Delete
                </button>

            </td>

        `;


        tbody.appendChild(row);

    });
}


// ===============================
// ADD STUDENT
// ===============================

const studentForm =
    document.getElementById("studentForm");


if (studentForm) {

    studentForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const student = {

                name:
                    document
                        .getElementById("studentName")
                        .value
                        .trim(),

                rollNumber:
                    document
                        .getElementById("rollNumber")
                        .value
                        .trim(),

                department:
                    document
                        .getElementById("department")
                        .value
                        .trim(),

                subject:
                    document
                        .getElementById("subject")
                        .value
                        .trim()

            };


            if (
                !student.name ||
                !student.rollNumber ||
                !student.department ||
                !student.subject
            ) {

                showToast(
                    "Please fill all student details.",
                    "warning"
                );

                return;
            }


            try {

                const response =
                    await fetch(
                        `${API}/students`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(student)
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    showToast(
                        data.message ||
                        "Unable to add student.",
                        "error"
                    );

                    return;
                }


                showToast(
                    "Student has been successfully registered.",
                    "success"
                );


                this.reset();


                closeModal(
                    "studentModal"
                );


                await loadStudents();


                // Refresh dashboard
                await loadDashboard();


            } catch (error) {

                console.error(error);

                showToast(
                    "Server error while adding student.",
                    "error"
                );
            }

        }
    );
}


// ===============================
// DELETE STUDENT
// ===============================

async function deleteStudent(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this student?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/students/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showToast(
                data.message ||
                "Unable to delete student.",
                "error"
            );

            return;
        }


        showToast(
            "Student has been deleted successfully.",
            "success"
        );


        await loadStudents();

        await loadDashboard();


    } catch (error) {

        console.error(error);

        showToast(
            "Server error while deleting student.",
            "error"
        );
    }
}


// ===============================
// SEARCH STUDENTS
// ===============================

function filterStudents() {

    const searchInput =
        document.getElementById("studentSearch");


    if (!searchInput) {
        return;
    }


    const search =
        searchInput
            .value
            .toLowerCase()
            .trim();


    const rows =
        document.querySelectorAll(
            "#studentTableBody tr"
        );


    rows.forEach(row => {

        const text =
            row.textContent.toLowerCase();


        row.style.display =
            text.includes(search)
                ? ""
                : "none";

    });
}


// ===============================
// ROOMS
// ===============================

async function loadRooms() {

    try {

        const response =
            await fetch(`${API}/rooms`);


        if (!response.ok) {
            throw new Error("Unable to load rooms");
        }


        rooms =
            await response.json();


        document.getElementById("roomCount").textContent =
            rooms.length;


        renderRooms();


    } catch (error) {

        console.error(
            "Room loading error:",
            error
        );

        showToast(
            "Unable to load rooms.",
            "error"
        );
    }
}


// ===============================
// RENDER ROOMS
// ===============================

function renderRooms() {

    const container =
        document.getElementById("roomGrid");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (rooms.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ▦
                </div>

                <h3>
                    No Examination Rooms
                </h3>

                <p>
                    Add rooms before generating
                    the seating arrangement.
                </p>

                <button
                    class="primary-btn"
                    onclick="openRoomModal()"
                >
                    + Add Room
                </button>

            </div>

        `;

        return;
    }


    rooms.forEach(room => {

        const capacity =
            Number(room.rows) *
            Number(room.columns);


        const card =
            document.createElement("div");


        card.className =
            "room-card";


        card.innerHTML = `

            <div class="room-top">

                <div class="room-number">

                    ${escapeHTML(
                        room.roomNumber
                    )}

                </div>

                <span class="room-badge">
                    Available
                </span>

            </div>


            <div class="room-building">

                ${escapeHTML(
                    room.building
                )}

            </div>


            <div class="room-details">

                <div>

                    <span>
                        Capacity
                    </span>

                    <strong>
                        ${capacity}
                    </strong>

                </div>


                <div>

                    <span>
                        Layout
                    </span>

                    <strong>
                        ${room.rows} × ${room.columns}
                    </strong>

                </div>

            </div>


            <button
                class="action-btn"
                style="margin-top:15px;"
                onclick="deleteRoom('${room._id}')"
            >
                Delete Room
            </button>

        `;


        container.appendChild(card);

    });
}


// ===============================
// ADD ROOM
// ===============================

const roomForm =
    document.getElementById("roomForm");


if (roomForm) {

    roomForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const room = {

                roomNumber:
                    document
                        .getElementById("roomNumber")
                        .value
                        .trim(),

                building:
                    document
                        .getElementById("building")
                        .value
                        .trim(),

                rows:
                    Number(
                        document
                            .getElementById("rows")
                            .value
                    ),

                columns:
                    Number(
                        document
                            .getElementById("columns")
                            .value
                    )

            };


            if (
                !room.roomNumber ||
                !room.building ||
                room.rows < 1 ||
                room.columns < 1
            ) {

                showToast(
                    "Please enter valid room details.",
                    "warning"
                );

                return;
            }


            try {

                const response =
                    await fetch(
                        `${API}/rooms`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(room)
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    showToast(
                        data.message ||
                        "Unable to add room.",
                        "error"
                    );

                    return;
                }


                showToast(
                    "Examination room added successfully.",
                    "success"
                );


                this.reset();


                closeModal(
                    "roomModal"
                );


                await loadRooms();

                await loadDashboard();


            } catch (error) {

                console.error(error);

                showToast(
                    "Server error while adding room.",
                    "error"
                );
            }

        }
    );
}


// ===============================
// DELETE ROOM
// ===============================

async function deleteRoom(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this room?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/rooms/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showToast(
                data.message ||
                "Unable to delete room.",
                "error"
            );

            return;
        }


        showToast(
            "Examination room deleted successfully.",
            "success"
        );


        await loadRooms();

        await loadDashboard();


    } catch (error) {

        console.error(error);

        showToast(
            "Server error while deleting room.",
            "error"
        );
    }
}


// ===============================
// GENERATE SEATING
// ===============================

async function generateSeating() {

    if (students.length === 0) {
        await loadStudents();
    }


    if (rooms.length === 0) {
        await loadRooms();
    }


    if (students.length === 0) {

        showToast(
            "Please add students before generating a seating plan.",
            "warning"
        );

        return;
    }


    if (rooms.length === 0) {

        showToast(
            "Please add examination rooms first.",
            "warning"
        );

        return;
    }


    try {

        showToast(
            "Generating intelligent seating plan...",
            "info"
        );


        const response =
            await fetch(
                `${API}/allocation`,
                {
                    method: "POST"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showToast(
                data.message ||
                "Unable to generate seating.",
                "error"
            );

            return;
        }


        allocationData =
            data.data;


        document.getElementById(
            "allocatedCount"
        ).textContent =
            data.allocatedStudents;


        document.getElementById(
            "unallocatedCount"
        ).textContent =
            data.unallocatedStudents;


        renderSeatingPlan(
            allocationData
        );


        showSection(
            "seating"
        );


        showToast(
            "Seating plan generated successfully.",
            "success"
        );


    } catch (error) {

        console.error(error);

        showToast(
            "Unable to generate seating plan.",
            "error"
        );
    }
}


// ===============================
// RENDER SEATING PLAN
// ===============================

function renderSeatingPlan(data) {

    const container =
        document.getElementById(
            "seatingContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        !data ||
        !data.allocation ||
        !data.allocation.length
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ▤
                </div>

                <h3>
                    No seating arrangement available.
                </h3>

            </div>

        `;

        return;
    }


    data.allocation.forEach(room => {

        const roomSection =
            document.createElement("div");


        roomSection.className =
            "seating-room";


        const header =
            document.createElement("div");


        header.className =
            "seating-header";


        header.innerHTML = `

            <div>

                <h3>
                    Room
                    ${escapeHTML(
                        room.roomNumber
                    )}
                </h3>

                <span>

                    ${escapeHTML(
                        room.building
                    )}

                    •

                    ${room.rows} × ${room.columns}

                </span>

            </div>


            <span>

                ${room.seats.length}
                seats allocated

            </span>

        `;


        roomSection.appendChild(
            header
        );


        const grid =
            document.createElement("div");


        grid.className =
            "seat-grid";


        grid.style.gridTemplateColumns =
            `repeat(
                ${room.columns},
                minmax(75px, 1fr)
            )`;


        const totalSeats =
            Number(room.rows) *
            Number(room.columns);


        for (
            let index = 0;
            index < totalSeats;
            index++
        ) {

            const row =
                Math.floor(
                    index / room.columns
                );


            const column =
                index % room.columns;


            const seat =
                room.seats.find(
                    item =>
                        item.row === row &&
                        item.column === column
                );


            const seatElement =
                document.createElement("div");


            if (seat) {

                seatElement.className =
                    "seat";


                seatElement.innerHTML = `

                    <strong>
                        R${row + 1}-S${column + 1}
                    </strong>

                    <span>
                        ${escapeHTML(
                            seat.student.name
                        )}
                    </span>

                    <small>
                        ${escapeHTML(
                            seat.student.subject
                        )}
                    </small>

                `;

            } else {

                seatElement.className =
                    "seat empty-seat";


                seatElement.innerHTML = `

                    <strong>
                        R${row + 1}-S${column + 1}
                    </strong>

                    <small>
                        Empty
                    </small>

                `;

            }


            grid.appendChild(
                seatElement
            );
        }


        roomSection.appendChild(
            grid
        );


        container.appendChild(
            roomSection
        );

    });


    if (
        data.unallocated &&
        data.unallocated.length > 0
    ) {

        const warning =
            document.createElement("div");


        warning.className =
            "result-card";


        warning.innerHTML = `

            <strong>

                ${data.unallocated.length}
                student(s) could not be allocated.

            </strong>

            <p
                style="
                    margin-top:8px;
                    color:#718096;
                    font-size:10px;
                "
            >

                Add more room capacity
                and generate the seating
                plan again.

            </p>

        `;


        container.appendChild(
            warning
        );
    }
}


// ===============================
// FIND STUDENT SEAT
// ===============================

async function findSeat() {

    const input =
        document.getElementById(
            "rollSearch"
        );


    const roll =
        input.value
            .trim()
            .toLowerCase();


    const result =
        document.getElementById(
            "seatResult"
        );


    result.innerHTML = "";


    if (!roll) {

        showToast(
            "Please enter a roll number.",
            "warning"
        );

        input.focus();

        return;
    }


    if (!allocationData) {

        showToast(
            "Generate the seating plan before searching for a seat.",
            "warning"
        );

        return;
    }


    const student =
        students.find(
            item =>
                String(
                    item.rollNumber
                )
                    .toLowerCase() === roll
        );


    if (!student) {

        result.innerHTML = `

            <div class="result-card">

                <strong>
                    Student not found
                </strong>

                <p
                    style="
                        margin-top:8px;
                        color:#718096;
                    "
                >
                    Check the roll number
                    and try again.
                </p>

            </div>

        `;

        return;
    }


    try {

        const response =
            await fetch(
                `${API}/allocation/students/${student._id}/seat`
            );


        const data =
            await response.json();


        if (!response.ok) {

            result.innerHTML = `

                <div class="result-card">

                    <strong>
                        Seat not allocated
                    </strong>

                    <p
                        style="
                            margin-top:8px;
                            color:#718096;
                        "
                    >

                        This student has not
                        received a seat.

                    </p>

                </div>

            `;

            return;
        }


        result.innerHTML = `

            <div class="result-card">

                <span class="section-label">
                    ALLOCATION FOUND
                </span>


                <h3
                    style="
                        margin-top:8px;
                    "
                >
                    ${escapeHTML(
                        data.student.name
                    )}
                </h3>


                <p
                    style="
                        color:#718096;
                        font-size:10px;
                        margin-top:4px;
                    "
                >

                    Roll Number:
                    ${escapeHTML(
                        data.student.rollNumber
                    )}

                </p>


                <div class="result-seat">

                    ${escapeHTML(
                        data.room
                    )}

                </div>


                <strong>

                    Row ${data.row}
                    •
                    Seat ${data.column}

                </strong>


                <p
                    style="
                        color:#718096;
                        font-size:10px;
                        margin-top:7px;
                    "
                >

                    ${escapeHTML(
                        data.building
                    )}

                </p>

            </div>

        `;


        showToast(
            "Seat allocation found successfully.",
            "success"
        );


    } catch (error) {

        console.error(error);

        showToast(
            "Unable to find seat.",
            "error"
        );
    }
}


// ===============================
// MODALS
// ===============================

function openStudentModal() {

    const modal =
        document.getElementById(
            "studentModal"
        );


    if (modal) {
        modal.classList.add("show");
    }
}


function openRoomModal() {

    const modal =
        document.getElementById(
            "roomModal"
        );


    if (modal) {
        modal.classList.add("show");
    }
}


function closeModal(id) {

    const modal =
        document.getElementById(id);


    if (modal) {
        modal.classList.remove("show");
    }
}


// ===============================
// CLOSE MODAL OUTSIDE CLICK
// ===============================

window.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList.contains(
                "modal"
            )
        ) {

            event.target.classList.remove(
                "show"
            );

        }

    }
);


// ===============================
// ESCAPE KEY
// ===============================

window.addEventListener(
    "keydown",
    function (event) {

        if (event.key !== "Escape") {
            return;
        }


        document
            .querySelectorAll(".modal.show")
            .forEach(modal => {

                modal.classList.remove(
                    "show"
                );

            });

    }
);


// ===============================
// SECURITY HELPER
// ===============================

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// ===============================
// GET INITIALS
// ===============================

function getInitials(name) {

    if (!name) {
        return "ST";
    }


    const words =
        String(name)
            .trim()
            .split(/\s+/);


    if (words.length === 1) {

        return words[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        words[0][0] +
        words[words.length - 1][0]
    ).toUpperCase();
}


// ===============================
// INITIAL LOAD
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        setCurrentDate();

        await loadDashboard();

    }
);