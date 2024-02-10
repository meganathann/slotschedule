import React, { useState, useEffect } from "react";
import moment from "moment";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Grow from '@mui/material/Grow';

import CircularProgress from "@mui/material/CircularProgress";

const PatientView = ({ username }) => {
  const [physiosAvailability, setPhysiosAvailability] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const [userAvailability, setUserAvailability] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhysiosAvailability = async () => {
      try {
        const response = await fetch(
          `https://slottheschedule.onrender.com/physioview/useravailability?physioId=1&username=physio@example.com`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUserAvailability(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching physio availability:", error.message);
      }
    };

    fetchPhysiosAvailability();
  }, [username]);

  const handleTimeSlotClick = (time) => {
    setSelectedTimeSlot({
      day: selectedDay,
      time,
    });
  };

  const renderTimeSlotsForDay = () => {
    if (!selectedDay || !selectedTimeRange) {
      return <p>Select a day and time range to see available time slots.</p>;
    }

    const uniqueTimeSlots = new Set();

    userAvailability
      .filter(
        (availability) =>
          availability.day === selectedDay &&
          isTimeInRange(availability.time, selectedTimeRange) &&
          !availability.remarks
      )
      .forEach((availability) => {
        uniqueTimeSlots.add(availability.time);
      });

    const filteredTimeSlots = Array.from(uniqueTimeSlots);

    return (
      <div className="time-slot-range">
        <Typography variant="h5" gutterBottom sx={{ color: "#007bff", fontSize: "2rem" }}>
          Available Time Slots for {selectedDay}:
        </Typography>
        {filteredTimeSlots.length > 0 ? (
          <Grid container spacing={2}>
            {filteredTimeSlots.map((time) => (
              <Slide direction="up" in={!loading} key={time}>
                <Grid item>
                  <Button
                    variant="contained"
                    className={`time-slot ${
                      selectedTimeSlot &&
                      selectedTimeSlot.day === selectedDay &&
                      selectedTimeSlot.time === time
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleTimeSlotClick({
                        day: selectedDay,
                        time,
                      })
                    }
                    sx={{
                      backgroundColor: "#4CAF50",
                      color: "#fff",
                      fontSize: "1rem",
                      boxShadow: "0 3px 5px 2px rgba(0, 0, 0, 0.2)",
                      // Add other styles as needed
                    }}
                  >
                    {time}
                  </Button>
                </Grid>
              </Slide>
            ))}
          </Grid>
        ) : (
          <p>No available time slots in the specified range.</p>
        )}
      </div>
    );
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

    const timeRanges = [
      { start: "5:00 AM", end: "8:00 AM" },
      { start: "8:00 AM", end: "11:00 AM" },
      { start: "11:00 AM", end: "2:00 PM" },
      { start: "2:00 PM", end: "5:00 PM" },
      { start: "5:00 PM", end: "8:00 PM" },
      { start: "8:00 PM", end: "11:00 PM" },
    ];

    return (
      <div className="day-buttons">
        {weekDays.map((day) => (
          <Button
            key={day}
            variant="contained"
            className={`day-button ${selectedDay === day ? "selected" : ""}`}
            onClick={() => setSelectedDay(day)}
            style={{
              margin: "8px",
              background: selectedDay === day
                ? "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)"
                : "",
              color: selectedDay === day ? "#FFFFFF" : "#000000",
              fontSize: "1rem",
            }}
          >
            {day}
          </Button>
        ))}
        <br />
        {timeRanges.map((range, index) => (
          <Button
            key={index}
            className={`filter-button ${
              selectedTimeRange && isTimeRangeSelected(range) ? "selected" : ""
            }`}
            onClick={() => handleTimeRangeButtonClick(range)}
            style={{
              margin: "8px",
              padding: "4px 5px",
              fontSize: "0.8rem",
              background: isTimeRangeSelected(range) ? "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)" : "",
              color: isTimeRangeSelected(range) ? "#FFFFFF" : "",
              border: "1px solid #2196F3",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            {`${range.start} - ${range.end}`}
          </Button>
        ))}
      </div>
    );
  };

  const isTimeInRange = (selectedTime) => {
    if (!selectedTimeRange) {
      return false;
    }

    const selectedMoment = moment(selectedTime, "hh:mm A");
    const startMoment = moment(selectedTimeRange.start, "hh:mm A");
    const endMoment = moment(selectedTimeRange.end, "hh:mm A");

    return (
      selectedMoment.isSameOrAfter(startMoment) &&
      selectedMoment.isBefore(endMoment)
    );
  };

  const isTimeRangeSelected = (range) => {
    return (
      selectedTimeRange &&
      selectedTimeRange.start === range.start &&
      selectedTimeRange.end === range.end
    );
  };

  const handleTimeRangeButtonClick = (range) => {
    setSelectedTimeRange(isTimeRangeSelected(range) ? null : range);
  };

  return (
    <Box
      sx={{
        border: "1px solid #ccc",
        padding: "10px",
        marginBottom: "15px",
        bgcolor: "#fff",
        borderRadius: "8px", // Add border radius for a softer look
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Add a subtle box shadow
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Roboto', color: "#007bff", fontWeight: 700, fontSize: "2.5rem" }}>
        PatientView
      </Typography>
      <Typography variant="h5" gutterBottom sx={{ color: "#007bff", fontSize: "2rem" }}>
        Welcome, {username}!
      </Typography>
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              {renderDayButtons()}
            </Grid>
            <Grid item xs={12} sm={6}>
              {renderTimeSlotsForDay()}
            </Grid>
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default PatientView;