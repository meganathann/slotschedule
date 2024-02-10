import React, { useState } from "react";
import PhysioView from "./components/PhysioView";
import PatientView from "./components/Patientview";
import SalesView from "./components/Salesview";
import Login from "./components/Login";
import Button from "@mui/material/Button";
import "./components/main.css";

function App() {
  const [user, setUser] = useState(null);

  const users = {
    physio: {
      id: 1,
      username: "physio@example.com",
      password: "physio123",
      role: "physio",
    },
    sales: {
      id: 2,
      username: "sales@example.com",
      password: "sales123",
      role: "sales",
    },
    patient: {
      id: 3,
      username: "patient@example.com",
      password: "patient123",
      role: "patient",
    },
  };

  const handleLogin = (credentials) => {
    const authenticatedUser = Object.values(users).find(
      (u) =>
        u &&
        u.username &&
        u.password &&
        u.username.toLowerCase() === credentials.email.toLowerCase() &&
        u.password === credentials.password
    );

    if (authenticatedUser) {
      setUser(authenticatedUser);
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="App">
      {user ? (
        <>
          {user.role === "physio" && (
            <PhysioView username={user.username} physioId={user.id} />
          )}
          {user.role === "sales" && (
            <SalesView username={user.username} users={users} />
          )}
          {user.role === "patient" && <PatientView username={user.username} />}
          <div className="logout-container">
            <Button
              onClick={handleLogout}
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "#45aaf2",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#007bff",
                },
                borderRadius: "8px", 
                marginTop: "10px", 
              }}
            >
              Logout
            </Button>
          </div>
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;