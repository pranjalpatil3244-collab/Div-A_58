function allocateSeats(students, rooms) {
  const waiting = [...students];
  const allocation = [];

  for (const room of rooms) {
    const seats = [];

    for (let row = 0; row < room.rows; row++) {
      for (let column = 0; column < room.columns; column++) {

        if (waiting.length === 0) {
          break;
        }

        const leftSeat = seats.find(
          seat => seat.row === row && seat.column === column - 1
        );

        const frontSeat = seats.find(
          seat => seat.row === row - 1 && seat.column === column
        );

        let studentIndex = waiting.findIndex(student => {
          const sameAsLeft =
            leftSeat &&
            leftSeat.student.subject === student.subject;

          const sameAsFront =
            frontSeat &&
            frontSeat.student.subject === student.subject;

          return !sameAsLeft && !sameAsFront;
        });

        // If no conflict-free student is available,
        // simply take the first remaining student.
        if (studentIndex === -1) {
          studentIndex = 0;
        }

        const student = waiting.splice(studentIndex, 1)[0];

        seats.push({
          row,
          column,
          student: {
            id: student._id,
            name: student.name,
            rollNumber: student.rollNumber,
            subject: student.subject
          }
        });
      }
    }

    allocation.push({
      roomId: room._id,
      roomNumber: room.roomNumber,
      building: room.building,
      rows: room.rows,
      columns: room.columns,
      seats
    });
  }

  return {
    allocation,
    unallocated: waiting
  };
}

module.exports = allocateSeats;