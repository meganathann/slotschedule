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
  const calculateTimeRange = (selectedTime) => {
    const ranges = [
      { start: "5:00 AM", end: "8:00 AM" },
      { start: "8:00 AM", end: "11:00 AM" },
      { start: "11:00 AM", end: "2:00 PM" },
      { start: "2:00 PM", end: "5:00 PM" },
      { start: "5:00 PM", end: "8:00 PM" },
      { start: "8:00 PM", end: "11:00 PM" },
    ];

    const range = ranges.find((r) => isTimeInRange(selectedTime, r));
    return range ? `${range.start} - ${range.end}` : "Not in range";
  };

  const isTimeInRange = (selectedTime, range) => {
    if (!range) {
      return false;
    }

    const selectedMoment = moment(selectedTime, "hh:mm A");
    const startMoment = moment(range.start, "hh:mm A");
    const endMoment = moment(range.end, "hh:mm A");

    return (
      selectedMoment.isSameOrAfter(startMoment) &&
      selectedMoment.isBefore(endMoment)
    );
  };

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
          <p>{`Physio: ${selectedTimeSlot.physioName}`}</p>

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

const SalesView = ({ username, physioId }) => {
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
  const isTimeInRange = (selectedTime, range) => {
    if (!range) {
      return false;
    }

    const selectedMoment = moment(selectedTime, "hh:mm A");
    const startMoment = moment(range.start, "hh:mm A");
    const endMoment = moment(range.end, "hh:mm A");

    return (
      selectedMoment.isSameOrAfter(startMoment) &&
      selectedMoment.isBefore(endMoment)
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
        isTimeInRange={isTimeInRange}
      />
    );
  };

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
  const [lockedTimeSlots, setLockedTimeSlots] = useState([]);

  // ...

  useEffect(() => {
    const fetchPhysiosAvailability = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/physioview/availabletimeslots"
          // Updated endpoint to the correct one
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPhysiosAvailability(data);
      } catch (error) {
        console.error("Error fetching physios availability:", error.message);
      }
    };

    fetchPhysiosAvailability();
  }, []);

  // ...

  const handleTimeSlotClick = (physio, time) => {
    setSelectedTimeSlot({
      day: selectedDay,
      time,
      physioName: physio.physioName,
      physioId: physio.physioId,
    });
  };

  const handleAllotButtonClick = async () => {
    if (remarks.trim() === "") {
      alert("Please enter remarks before allotting the slot.");
      return;
    }

    try {
      // Send a request to lock time slots with remarks
      const response = await fetch(
        "http://localhost:3001/salesview/locktimeslot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            physioId: selectedTimeSlot.physioId,
            remarks: remarks,
          }),
        }
      );

      const data = await response.json();
      console.log("Response from server:", data);

      // Update the state with the locked time slots
      setLockedTimeSlots(data.lockedTimeSlots);

      // Reset the state after successful locking
      setSelectedTimeSlot(null);
      setRemarks("");
    } catch (error) {
      console.error("Error locking time slots:", error);
      // Handle error as needed
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
      <div className="day-buttons">
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
      </div>
    );
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
          .filter(
            (av) =>
              av.day === selectedDay &&
              isTimeInRange(av.time, selectedTimeRange)
          )
          .map((av) => ({
            physioId: physio.physioId,
            physioName: physio.physioName,
            time: av.time,
          }));
      })
      .flat();

    return (
      <div className="time-slot-range">
        <Typography variant="h5" gutterBottom>
          Available Time Slots for {selectedDay}:
        </Typography>
        {filteredTimeSlots.length > 0 ? (
          <Grid container spacing={2}>
            {filteredTimeSlots.map((av) => (
              <Grid item key={`${av.physioId}-${av.time}`}>
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
    setSelectedTimeRange(isTimeRangeSelected(range) ? null : range);
  };

  const isTimeRangeSelected = (range) => {
    return (
      selectedTimeRange &&
      selectedTimeRange.start === range.start &&
      selectedTimeRange.end === range.end
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
              selectedTimeRange && isTimeRangeSelected(range) ? "selected" : ""
            }
            onClick={() => handleTimeRangeButtonClick(range)}
            variant={
              selectedTimeRange && isTimeRangeSelected(range)
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
      {renderModal()} {/* Ensure renderModal is called here */}
    </Box>
  );
};

export default SalesView;
