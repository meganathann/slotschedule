// PatientView.jsx
import React, { useState, useEffect } from "react";
import moment from "moment";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import "./main.css";

const PatientView = ({ username }) => {
  const [physiosAvailability, setPhysiosAvailability] = useState([
    {
      _id: {
        $oid: "65be9613d22e8c231fbde27b",
      },
      physioId: "1",
      physioName: "John Doe",
      weeklyAvailability: [
        {
          day: "Monday",
          time: "10:00 AM",
        },
        {
          day: "Monday",
          time: "10:45 AM",
        },
        {
          day: "Tuesday",
          time: "11:30 AM",
        },
        {
          day: "Wednesday",
          time: "02:00 PM",
        },
        {
          day: "Wednesday",
          time: "03:15 PM",
        },
      ],
      __v: 0,
    },
    {
      _id: {
        $oid: "65be9613d22e8c231fbde27c",
      },
      physioId: "2",
      physioName: "Jane Smith",
      weeklyAvailability: [
        {
          day: "Monday",
          time: "09:30 AM",
        },
        {
          day: "Tuesday",
          time: "02:45 PM",
        },
        {
          day: "Wednesday",
          time: "01:00 PM",
        },
        {
          day: "Thursday",
          time: "11:30 AM",
        },
        {
          day: "Friday",
          time: "03:30 PM",
        },
      ],
      __v: 0,
    },
  ]);

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

  useEffect(() => {
    // Fetch data from your API endpoint
    // Uncomment and fill in the details if fetching from an API
    /*
    const fetchPhysiosAvailability = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/getPhysiosAvailability");
        const data = await response.json();
        setPhysiosAvailability(data);
      } catch (error) {
        console.error("Error fetching physios availability:", error);
      }
    };

    // Uncomment the line below and remove the sample data if fetching from an API
    // fetchPhysiosAvailability();
    */
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

    const allPhysios = physiosAvailability;

    const physiosForDay = allPhysios.filter((physio) =>
      physio.weeklyAvailability.some(
        (availability) => availability.day === selectedDay
      )
    );

    if (!physiosForDay.length) {
      return <p>No available time slots for the selected day.</p>;
    }

    const filteredTimeSlots = physiosForDay
      .map((physio) => {
        return physio.weeklyAvailability
          .filter((av) => av.day === selectedDay && isTimeInRange(av.time))
          .map((av) => av.time);
      })
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
            className={selectedDay === day ? "selected" : ""}
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </Button>
        ))}
        <br />
        {timeRanges.map((range, index) => (
          <Button
            key={index}
            variant="contained"
            className={
              selectedTimeRange && isTimeRangeSelected(range) ? "selected" : ""
            }
            onClick={() => handleTimeRangeButtonClick(range)}
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
