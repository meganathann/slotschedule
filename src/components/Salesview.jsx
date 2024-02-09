import React, { useState, useEffect } from "react";
import moment from "moment";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Button as MuiButton } from "@mui/material";

// ... (imports)

const CustomModal = ({
  selectedTimeSlot,
  setRemarks,
  remarks,
  handleAllotButtonClick,
  handleClose,
}) => {
  return (
    <Modal
      open={Boolean(selectedTimeSlot)}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Selected Time Slot
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <p>{`Day: ${selectedTimeSlot.day}`}</p>
          <p>{`Time: ${selectedTimeSlot.time}`}</p>
          <p>{`Physio: ${
            selectedTimeSlot.physioName || "physio@example.com"
          }`}</p>
          {/* Remarks input */}
          <TextField
            label="Remarks"
            id="remarks"
            multiline
            rows={4}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter remarks here..."
            sx={{ mt: 2, width: "100%" }}
          />

          <Button
            onClick={handleAllotButtonClick}
            variant="contained"
            sx={{ mt: 2, mr: 2 }}
          >
            Allot
          </Button>

          <Button onClick={handleClose} variant="outlined" sx={{ mt: 2 }}>
            Close
          </Button>
        </Typography>
      </Box>
    </Modal>
  );
};

const SalesView = ({ username, users }) => {
  const ranges = [
    { start: "5:00 AM", end: "8:00 AM" },
    { start: "8:00 AM", end: "11:00 AM" },
    { start: "11:00 AM", end: "2:00 PM" },
    { start: "2:00 PM", end: "5:00 PM" },
    { start: "5:00 PM", end: "8:00 PM" },
    { start: "8:00 PM", end: "11:00 PM" },
  ];

  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [userAvailability, setUserAvailability] = useState([]);

  useEffect(() => {
    const fetchUserAvailability = async () => {
      try {
        console.log("Request parameters:", { physioId: 1, username });
        const response = await fetch(
          `http://localhost:3001/physioview/useravailability?physioId=1&username=physio@example.com`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch user availability. Status: ${response.status}`
          );
        }

        const data = await response.json();
        console.log("Fetched data:", data);
        setUserAvailability(data);
      } catch (error) {
        console.error("Error fetching user availability:", error);
      }
    };

    fetchUserAvailability();
  }, [username]);

  const isTimeInRange = (selectedTime, range) => {
    const selectedMoment = moment(selectedTime, "hh:mm A");
    const startMoment = moment(range.start, "hh:mm A");
    const endMoment = moment(range.end, "hh:mm A");

    return (
      selectedMoment.isSameOrAfter(startMoment) &&
      selectedMoment.isBefore(endMoment)
    );
  };
  const handleTimeSlotClick = (availability, time) => {
    console.log("Availability clicked:", availability);
    console.log(
      "Availability structure:",
      JSON.stringify(availability, null, 2)
    );
    setSelectedTimeSlot({
      day: selectedDay,
      time,
      physioName: availability.username, // Make sure availability contains username
      physioId: availability.physioId,
    });
  };

  const handleAllotButtonClick = () => {
    if (remarks.trim() === "") {
      alert("Please enter remarks before allotting the slot.");
      return;
    }

    // Simulate backend interaction by logging data
    console.log("Remarks:", remarks);
    console.log("Selected Time Slot:", selectedTimeSlot);

    // Reset the state after simulated backend interaction
    setSelectedTimeSlot(null);
    setRemarks("");
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

    return (
      <>
        {weekDays.map((day) => (
          <Button
            key={day}
            variant={selectedDay === day ? "contained" : "outlined"}
            onClick={() => setSelectedDay(day)}
            sx={{ m: 1 }}
          >
            {day}
          </Button>
        ))}
      </>
    );
  };

  const renderTimeSlotsForDay = () => {
    if (!selectedDay || !selectedTimeRange) {
      return <p>Select a day and time range to see available time slots.</p>;
    }

    const filteredTimeSlots = userAvailability
      .filter((availability) => availability.day === selectedDay)
      .map((availability) => ({
        time: availability.time,
      }));

    return (
      <div className="time-slot-range">
        <Typography variant="h5" gutterBottom>
          Available Time Slots for {selectedDay}:
        </Typography>
        {filteredTimeSlots.length > 0 ? (
          <Grid container spacing={2}>
            {filteredTimeSlots.map((av) => (
              <Grid item key={av.time}>
                <MuiButton
                  variant="contained"
                  className={`time-slot ${
                    selectedTimeSlot &&
                    selectedTimeSlot.day === selectedDay &&
                    selectedTimeSlot.time === av.time
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleTimeSlotClick(av, av.time)}
                >
                  {av.time}
                </MuiButton>
              </Grid>
            ))}
          </Grid>
        ) : (
          <p>
            No available time slots in the specified range for the selected day.
          </p>
        )}
      </div>
    );
  };

  const handleTimeRangeButtonClick = (range) => {
    setSelectedTimeRange(
      selectedTimeRange && isTimeInRangeSelected(range) ? null : range
    );
  };

  const isTimeInRangeSelected = (range) => {
    return (
      selectedTimeRange &&
      selectedTimeRange.start === range.start &&
      selectedTimeRange.end === range.end
    );
  };

  const renderModal = () => {
    if (!selectedTimeSlot) {
      return null;
    }

    return (
      <CustomModal
        selectedTimeSlot={selectedTimeSlot}
        setRemarks={setRemarks}
        remarks={remarks}
        handleAllotButtonClick={handleAllotButtonClick}
        handleClose={() => setSelectedTimeSlot(null)}
      />
    );
  };

  return (
    <Box className="sales-view" component="div">
      <Typography variant="h5" gutterBottom>
        Welcome, {username}!
      </Typography>
      <h1>Sales View</h1>
      <div className="day-buttons">{renderDayButtons()}</div>
      <div className="time-range-filters">
        {ranges.map((range, index) => (
          <Button
            key={index}
            className={
              selectedTimeRange && isTimeInRangeSelected(range)
                ? "selected"
                : ""
            }
            onClick={() => handleTimeRangeButtonClick(range)}
            variant={
              selectedTimeRange && isTimeInRangeSelected(range)
                ? "contained"
                : "outlined"
            }
            sx={{ m: 1 }}
          >
            {`${range.start} - ${range.end}`}
          </Button>
        ))}
      </div>
      {renderTimeSlotsForDay()}
      {renderModal()}
    </Box>
  );
};

export default SalesView;
