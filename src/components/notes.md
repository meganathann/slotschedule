import React, { useState } from "react";
import moment from "moment";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Button as MuiButton } from "@mui/material";

const PhysioView = ({ physioId, username }) => {
const [selectedDay, setSelectedDay] = useState(null);
const [weeklyAvailability, setWeeklyAvailability] = useState([]);

const [disableTimeSlots, setDisableTimeSlots] = useState(false);
const [selectedRange, setSelectedRange] = useState(null);
const [selectedTimeRange, setSelectedTimeRange] = useState(null);
const [showModal, setShowModal] = useState(false);
const [confirmationMessage, setConfirmationMessage] = useState(null);
const [alertMessage, setAlertMessage] = useState(null);

const handleDaySelection = (day) => {
setSelectedDay(day);
setDisableTimeSlots(false);
};

const handleAvailabilitySelection = (time) => {
const selectedDateTime = moment(`${selectedDay} ${time}`, "dddd h:mm A");
const endTime = selectedDateTime.clone().add(45, "minutes");

    const isOverlapping = weeklyAvailability.some((slot) => {
      const slotStartTime = moment(`${slot.day} ${slot.time}`, "dddd h:mm A");
      return (
        selectedDateTime.isBetween(
          slotStartTime,
          slotStartTime.clone().add(45, "minutes")
        ) ||
        endTime.isBetween(
          slotStartTime,
          slotStartTime.clone().add(45, "minutes")
        )
      );
    });

    if (isOverlapping) {
      setAlertMessage(
        "Time slot cannot be selected within 45 minutes of another slot."
      );

      // Clear the alert message after 3 to 5 seconds
      setTimeout(() => {
        setAlertMessage(null);
      }, 3000); // 3 seconds in milliseconds

      return;
    }

    setWeeklyAvailability((prevAvailability) => {
      const updatedAvailability = [...prevAvailability];
      const existingSlotIndex = updatedAvailability.findIndex(
        (slot) =>
          slot.day === selectedDay &&
          slot.time === time &&
          slot.physioId === physioId
      );

      if (existingSlotIndex !== -1) {
        updatedAvailability.splice(existingSlotIndex, 1);
      } else {
        updatedAvailability.push({
          day: selectedDay,
          time,
          physioId,
          username: "physio@example.com", // Add other details as needed
          lockedBy: "physioview",
          __v: 0,
        });
      }

      return updatedAvailability;
    });

    setDisableTimeSlots(true);
    setTimeout(() => {
      setDisableTimeSlots(false);
    }, 2700000); // 45 minutes in milliseconds

};

const generateTimeSlotsForDay = (day, start, end) => {
const startTime = moment(start, "h:mm A");
const endTime = moment(end, "h:mm A");
const timeSlots = [];

    let currentTime = moment(startTime);

    while (currentTime.isBefore(endTime)) {
      const formattedTime = currentTime.format("h:mm A");
      const isSelected = weeklyAvailability.some(
        (slot) => slot.day === day && slot.time === formattedTime
      );

      const isOverlapping = weeklyAvailability.some((slot) => {
        const slotStartTime = moment(`${slot.day} ${slot.time}`, "dddd h:mm A");
        return (
          currentTime.isBetween(
            slotStartTime,
            slotStartTime.clone().add(45, "minutes")
          ) ||
          endTime.isBetween(
            slotStartTime,
            slotStartTime.clone().add(45, "minutes")
          )
        );
      });

      const isSelectable = !isOverlapping;

      timeSlots.push({
        time: formattedTime,
        available: isSelectable,
        selected: isSelected,
      });

      currentTime.add(15, "minutes");
    }

    return timeSlots;

};

const renderDayButtons = () => {
const weekDays = [
"Monday",
"Tuesday",
"Wednesday",
"Thursday",
"Friday",
"Saturday",
];

    return weekDays.map((day) => (
      <Button
        key={day}
        variant={selectedDay === day ? "contained" : "outlined"}
        onClick={() => handleDaySelection(day)}
        sx={{ m: 1 }}
      >
        {day}
      </Button>
    ));

};

const renderTimeRangeFilters = () => {
if (!selectedDay) {
return null;
}

    const ranges = [
      { start: "5:00 AM", end: "8:00 AM" },
      { start: "8:00 AM", end: "11:00 AM" },
      { start: "11:00 AM", end: "2:00 PM" },
      { start: "2:00 PM", end: "5:00 PM" },
      { start: "5:00 PM", end: "8:00 PM" },
      { start: "8:00 PM", end: "11:00 PM" },
    ];

    return (
      <div className="time-range-filters">
        {ranges.map((range, index) => (
          <Button
            key={index}
            onClick={() => filterTimeRange(range.start, range.end)}
            variant={
              selectedTimeRange &&
              selectedTimeRange.start === range.start &&
              selectedTimeRange.end === range.end
                ? "contained"
                : "outlined"
            }
            sx={{ m: 1 }}
          >
            {`${range.start} - ${range.end}`}
          </Button>
        ))}
      </div>
    );

};

const filterTimeRange = (start, end) => {
if (!selectedDay) {
console.error("Select a day first.");
return;
}

    setSelectedRange({ start, end });
    setSelectedTimeRange({ start, end });

};

const renderTimeSlotsForDay = () => {
if (!selectedDay || !selectedRange) {
return (
<Typography>
Select a day and range to see available time slots.
</Typography>
);
}

    const timeSlots = generateTimeSlotsForDay(
      selectedDay,
      selectedRange.start,
      selectedRange.end
    );

    if (!timeSlots.length) {
      return (
        <Typography>
          No available time slots for the selected day and range.
        </Typography>
      );
    }
    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {selectedDay}'s Available Time Slots
        </Typography>
        <Grid container spacing={1}>
          {timeSlots.map((timeSlot) => (
            <Grid item key={`${selectedDay}-${timeSlot.time}`}>
              <Button
                className={`time-slot ${timeSlot.selected ? "selected" : ""}`}
                onClick={() => handleAvailabilitySelection(timeSlot.time)}
                style={{
                  backgroundColor: timeSlot.available
                    ? timeSlot.selected
                      ? "#3498db" // Blue color for selected time slots
                      : "var(--primary-color)"
                    : "#f1f1f1",
                  cursor: timeSlot.available ? "pointer" : "not-allowed",
                  color: timeSlot.selected ? "#fff" : "#000", // Text color for selected time slots
                  borderRadius: "4px", // Rounded corners
                  padding: "10px", // Adjust padding as needed
                  margin: "5px", // Adjust margin as needed
                  border: timeSlot.available ? "1px solid #000" : "none", // Border for outlined slots
                }}
                variant={
                  timeSlot.available && timeSlot.selected
                    ? "contained"
                    : "outlined"
                }
              >
                {timeSlot.time}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>
    );

};
const renderTimeSlotsForWeek = () => {
if (!selectedRange) {
return (
<Typography>Select a range to see available time slots.</Typography>
);
}

    return (
      <Box sx={{ mt: 2 }}>
        <Button onClick={() => setShowModal(true)} variant="contained">
          Next
        </Button>
      </Box>
    );

};

const saveSlotsToDatabase = async (requestData) => {
try {
// Replace this with your logic for saving slots to the database
console.log("Saving slots to the database:", requestData);

      // Example: Use fetch to send a POST request to the database endpoint
      const response = await fetch(
        "https://slottheschedule.onrender.com/physioview/choosetimeslot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const responseData = await response.json();

      // Log the response for debugging
      console.log("Database response:", responseData);

      if (response.ok) {
        console.log("Slots saved to the database successfully!");
        setConfirmationMessage("Slots saved to the database successfully!");
      } else {
        console.error(
          "Error saving slots to the database:",
          responseData.error
        );
        setConfirmationMessage("Error saving slots to the database");
      }
    } catch (error) {
      console.error("Error saving slots to the database:", error);
      setConfirmationMessage("Error saving slots to the database");
    }

};

const handleConfirmSlots = async () => {
let requestData; // Declare requestData outside the try block

    try {
      requestData = {
        physioId: physioId.toString(),
        username: username,
        weeklyAvailability: weeklyAvailability.map(({ day, time }) => ({
          day,
          time,
        })),
      };

      console.log("Request Data:", requestData);

      const response = await fetch(
        "https://slottheschedule.onrender.com/physioview/choosetimeslot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const responseData = await response.json();

      // Log the response for debugging
      console.log("Server response:", responseData);

      if (response.ok) {
        setConfirmationMessage("Slots confirmed and saved successfully!");
      } else {
        console.error("Error confirming slots:", responseData.error);

        // Display a user-friendly error message if needed
        // alert(`Error: ${responseData.error}`);

        // Proceed to save slots to the database even if there is an error
        saveSlotsToDatabase(requestData);
      }
    } catch (error) {
      console.error("Error confirming slots:", error);

      // Display a generic error message if needed
      // alert("An error occurred while confirming slots. Please try again.");

      // Proceed to save slots to the database even if there is an error
      saveSlotsToDatabase(requestData);
    }

};

// Rest of the code...

const renderModal = () => {
if (!showModal) {
return null;
}

    const slotsByDayAndTime = weeklyAvailability.reduce(
      (acc, { day, time }) => {
        if (!acc[day]) {
          acc[day] = {};
        }
        acc[day][time] = true;
        return acc;
      },
      {}
    );

    const uniqueTimes = [
      ...new Set(weeklyAvailability.map((slot) => slot.time)),
    ];

    return (
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Paper sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
              Selected Slots
            </Typography>
            {confirmationMessage ? (
              <Typography>{confirmationMessage}</Typography>
            ) : (
              <>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Time</TableCell>
                      {uniqueTimes.map((time) => (
                        <TableCell key={time} align="center">
                          {time}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(slotsByDayAndTime).map((day) => (
                      <TableRow key={day}>
                        <TableCell>{day}</TableCell>
                        {uniqueTimes.map((time) => (
                          <TableCell key={`${day}-${time}`} align="center">
                            {slotsByDayAndTime[day][time] ? "X" : ""}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button
                  onClick={handleConfirmSlots}
                  variant="contained"
                  sx={{ mt: 2 }}
                >
                  Confirm Slots
                </Button>
              </>
            )}
            <Button
              onClick={() => setShowModal(false)}
              variant="outlined"
              sx={{ mt: 2, ml: 1 }}
            >
              Close
            </Button>
          </Paper>
        </Box>
      </Modal>
    );

};

// ...

return (

<div className="physio-view">
<Typography variant="h5" gutterBottom>
Welcome, {username}!
</Typography>
<Typography variant="h4" gutterBottom>
PhysioView
</Typography>
<Typography>Select a day:</Typography>
<Grid container spacing={1} className="day-buttons">
{renderDayButtons()}
</Grid>
<Typography>Select a range:</Typography>
{renderTimeRangeFilters()}
<Typography>Available time slots:</Typography>
<div className="weekly-availability">
{renderTimeSlotsForDay()}
{selectedRange && (
<Box sx={{ mt: 2 }}>
<Button onClick={() => setShowModal(true)} variant="contained">
Next
</Button>
</Box>
)}
{renderModal()}
</div>
{alertMessage && (
<div className="alert">
<Typography color="error">{alertMessage}</Typography>
</div>
)}
</div>
);
};

export default PhysioView;
