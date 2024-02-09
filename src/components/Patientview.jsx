import React, { useState, useEffect } from "react";
import moment from "moment";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const PatientView = ({ username }) => {
  const [physiosAvailability, setPhysiosAvailability] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);

  useEffect(() => {
    const fetchPhysiosAvailability = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/getPhysiosAvailability"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched physios availability:", data);
        setPhysiosAvailability(data);
      } catch (error) {
        console.error("Error fetching physios availability:", error.message);
      }
    };

    fetchPhysiosAvailability();
  }, []);

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

    const filteredTimeSlots = physiosAvailability
      .filter((physio) =>
        physio.weeklyAvailability.some(
          (availability) =>
            availability.day === selectedDay && isTimeInRange(availability.time)
        )
      )
      .map((physio) =>
        physio.weeklyAvailability
          .filter((availability) => isTimeInRange(availability.time))
          .map((availability) => availability.time)
      )
      .flat();

    return (
      <div className="time-slot-range">
        <Typography variant="h5" gutterBottom>
          Available Time Slots for {selectedDay}:
        </Typography>
        {filteredTimeSlots.length > 0 ? (
          <Grid container spacing={2}>
            {filteredTimeSlots.map((time) => (
              <Grid item key={time}>
                <Button
                  variant="contained"
                  className={`time-slot ${
                    selectedTimeSlot &&
                    selectedTimeSlot.day === selectedDay &&
                    selectedTimeSlot.time === time
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleTimeSlotClick(time)}
                >
                  {time}
                </Button>
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
              backgroundColor: selectedDay === day ? "#70a3c7" : "",
              color: selectedDay === day ? "#FFFFFF" : "#000000",
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
              backgroundColor: isTimeRangeSelected(range) ? "#2196F3" : "",
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
    <div className="patient-view">
      <Typography variant="h4" gutterBottom>
        Welcome, {username}!
      </Typography>
      <Typography variant="h5" gutterBottom>
        Patient View
      </Typography>
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            {renderDayButtons()}
          </Grid>
          <Grid item xs={12} sm={6}>
            {renderTimeSlotsForDay()}
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default PatientView;
