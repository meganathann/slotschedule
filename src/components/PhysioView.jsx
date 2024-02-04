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

import "./main.css";

const PhysioView = ({ physioId, username }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [weeklyAvailability, setWeeklyAvailability] = useState([]);
  const [disableTimeSlots, setDisableTimeSlots] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState(null);

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

    setWeeklyAvailability((prevAvailability) => {
      const updatedAvailability = [...prevAvailability];
      const existingSlotIndex = updatedAvailability.findIndex(
        (slot) => slot.day === selectedDay && slot.time === time
      );

      if (existingSlotIndex !== -1) {
        updatedAvailability.splice(existingSlotIndex, 1);
      } else if (!isOverlapping) {
        updatedAvailability.push({ day: selectedDay, time });
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
                      ? "var(--secondary-color)" // Use secondary color for selected time slots
                      : "var(--primary-color)" // Use primary color for selectable time slots
                    : "#f1f1f1", // Grey for unavailable time slots
                  cursor: timeSlot.available ? "pointer" : "not-allowed",
                }}
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

  const handleConfirmSlots = async () => {
    try {
      const requestData = {
        physioId: physioId,
        weeklyAvailability: weeklyAvailability,
      };

      const response = await fetch("http://localhost:3001/api/saveSlots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();

      if (responseData.success) {
        setConfirmationMessage("Slots confirmed and saved successfully!");
      } else {
        console.error("Error saving slots:", responseData.error);
      }
    } catch (error) {
      console.error("Error confirming slots:", error);
    }
  };

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
            )}
            <Button
              onClick={handleConfirmSlots}
              variant="contained"
              sx={{ mt: 2 }}
            >
              Confirm Slots
            </Button>
          </Paper>
        </Box>
      </Modal>
    );
  };

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
    </div>
  );
};

export default PhysioView;
