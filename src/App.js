import React, { useState } from "react";
// import "./components/main.css";
import PhysioView from "./components/PhysioView";
import PatientView from "./components/Patientview";
import SalesView from "./components/Salesview";
import Login from "./components/Login";
import Button from "@mui/material/Button";

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
    const authenticatedUser = Object.values(users).find((u) => {
      if (u && u.username && u.password) {
        const lowercaseUsername = u.username.toLowerCase();
        const lowercaseInputUsername = credentials.email.toLowerCase();

        return (
          lowercaseUsername === lowercaseInputUsername &&
          u.password === credentials.password
        );
      }
      return false;
    });

    if (authenticatedUser) {
      setUser(authenticatedUser);
    } else {
      console.log("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="App">
      {user ? (
        <>
          {user.role === "physio" ? (
            <PhysioView username={user.username} physioId={user.id} />
          ) : user.role === "sales" ? (
            <SalesView username={user.username} />
          ) : user.role === "patient" ? (
            <PatientView username={user.username} />
          ) : null}
          <div className="logout-container">
            <Button onClick={handleLogout} variant="outlined" color="primary">
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
