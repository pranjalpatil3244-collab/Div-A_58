const express = require("express");
const Student = require("../models/Student");
const Room = require("../models/Room");
const allocateSeats = require("../allocator");

const router = express.Router();

let currentAllocation = null;

// Generate Seating Arrangement
router.post("/", async (req, res) => {
  try {
    const students = await Student.find();
    const rooms = await Room.find();

    if (students.length === 0) {
      return res.status(400).json({
        message: "No students available for allocation"
      });
    }

    if (rooms.length === 0) {
      return res.status(400).json({
        message: "No rooms available for allocation"
      });
    }

    currentAllocation = allocateSeats(students, rooms);

    res.json({
      message: "Seating arrangement generated successfully",
      totalStudents: students.length,
      allocatedStudents:
        students.length - currentAllocation.unallocated.length,
      unallocatedStudents: currentAllocation.unallocated.length,
      data: currentAllocation
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// Get Complete Allocation
router.get("/", (req, res) => {
  if (!currentAllocation) {
    return res.status(404).json({
      message: "No seating arrangement generated yet"
    });
  }

  res.json(currentAllocation);
});

// Get Room-wise Allocation
router.get("/rooms/:roomId", (req, res) => {
  if (!currentAllocation) {
    return res.status(404).json({
      message: "No seating arrangement generated yet"
    });
  }

  const room = currentAllocation.allocation.find(
    room => room.roomId.toString() === req.params.roomId
  );

  if (!room) {
    return res.status(404).json({
      message: "Room allocation not found"
    });
  }

  res.json(room);
});

// Find Student Seat
router.get("/students/:id/seat", (req, res) => {
  if (!currentAllocation) {
    return res.status(404).json({
      message: "No seating arrangement generated yet"
    });
  }

  for (const room of currentAllocation.allocation) {
    const seat = room.seats.find(
      seat => seat.student.id.toString() === req.params.id
    );

    if (seat) {
      return res.json({
        student: seat.student,
        room: room.roomNumber,
        building: room.building,
        row: seat.row + 1,
        column: seat.column + 1
      });
    }
  }

  res.status(404).json({
    message: "Student has not been allocated a seat"
  });
});

// Validate Seating Arrangement
router.get("/validate", (req, res) => {
  if (!currentAllocation) {
    return res.status(404).json({
      message: "No seating arrangement generated yet"
    });
  }

  const conflicts = [];

  currentAllocation.allocation.forEach(room => {
    room.seats.forEach(seat => {

      const leftSeat = room.seats.find(
        s =>
          s.row === seat.row &&
          s.column === seat.column - 1
      );

      const frontSeat = room.seats.find(
        s =>
          s.row === seat.row - 1 &&
          s.column === seat.column
      );

      if (
        leftSeat &&
        leftSeat.student.subject === seat.student.subject
      ) {
        conflicts.push({
          room: room.roomNumber,
          student: seat.student.name,
          conflictWith: leftSeat.student.name
        });
      }

      if (
        frontSeat &&
        frontSeat.student.subject === seat.student.subject
      ) {
        conflicts.push({
          room: room.roomNumber,
          student: seat.student.name,
          conflictWith: frontSeat.student.name
        });
      }
    });
  });

  res.json({
    valid: conflicts.length === 0,
    conflicts
  });
});

module.exports = router;