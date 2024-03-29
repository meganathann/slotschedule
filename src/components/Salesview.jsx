import React, { useState, useEffect } from "react";
import moment from "moment";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Button as MuiButton } from "@mui/material";

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
          width: "90%",
          maxWidth: "400px",
          bgcolor: "#fff",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)", 
          p: 4,
        }}
      >
       <Typography
  id="modal-modal-title"
  variant="h6"
  component="h2"
  sx={{ color: "#ff5722" }} 
>
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
        const response = await fetch(
          `https://slottheschedule.onrender.com/physioview/useravailability?physioId=1&username=physio@example.com`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch user availability. Status: ${response.status}`
          );
        }

        const data = await response.json();
        setUserAvailability(data);
      } catch (error) {
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
    setSelectedTimeSlot({
      day: selectedDay,
      time,
      physioName: availability.username,
      physioId: availability.physioId,
    });
  };

  const handleAllotButtonClick = async () => {
    if (remarks.trim() === "") {
      alert("Please enter remarks before allotting the slot.");
      return;
    }

    try {
      const response = await fetch(
        "https://slottheschedule.onrender.com/physioview/choosetimeslot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            physioId: parseInt(selectedTimeSlot.physioId),
            username,
            weeklyAvailability: [
              {
                day: selectedTimeSlot.day,
                time: selectedTimeSlot.time,
                remark: remarks,
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to allot time slot. Status: ${response.status}`
        );
      }

      const data = await response.json();
      setSelectedTimeSlot(null);
      setRemarks("");
    } catch (error) {
    }
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

    const uniqueTimeSlots = [];
    userAvailability
      .filter(
        (availability) =>
          availability.day === selectedDay &&
          isTimeInRange(availability.time, selectedTimeRange)
      )
      .forEach((availability) => {
        const timeSlot = {
          time: moment(availability.time, "HH:mm").format("h:mm A"),
        };

        const isDuplicate = uniqueTimeSlots.some(
          (slot) => slot.time === timeSlot.time
        );

        if (!isDuplicate) {
          uniqueTimeSlots.push(timeSlot);
        }
      });

    return (
      <div className="time-slot-range">
        
        {uniqueTimeSlots.length > 0 ? (
          <Grid container spacing={2}>
            {uniqueTimeSlots.map((av) => (
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
    <Box
      className="sales-view"
      component="div"
      sx={{ padding: 4, backgroundColor: "#f9f9f9", borderRadius: "8px" }}
    >
        <Typography variant="h4" gutterBottom sx={{ color: "#007bff", fontWeight: 700, fontSize: "2.5rem" }}>
        Sales View
      </Typography>
<Typography variant="h5" gutterBottom sx={{ color: "#007bff", fontWeight: 700, fontSize: "2rem", marginBottom: "10px" }}>
        Welcome, {username}!
      </Typography>
    
      <Grid container spacing={2}>
        {renderDayButtons()}
      </Grid>

      <div className="time-range-filters" sx={{ marginTop: 2 }}>
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

      <div className="time-slot-range" sx={{ marginTop: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ color: "#007bff", fontWeight: 700, fontSize: "1.5rem" }}>
          Available Time Slots for {selectedDay}:
        </Typography>
        {renderTimeSlotsForDay()}
      </div>

      {renderModal()}
    </Box>
  );
};

export default SalesView;
