import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import "./main.css";

const Login = ({ onLogin }) => {
  const [user_id, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    onLogin({ user_id, password });
  };

  return (
    <Box
      className="login-container"
      component="form"
      onSubmit={handleLogin}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="user-id"
        label="User ID"
        variant="outlined"
        margin="normal"
        fullWidth
        value={user_id}
        onChange={(e) => setUserId(e.target.value)}
        required
      />

      <TextField
        id="password"
        label="Password"
        variant="outlined"
        type="password"
        margin="normal"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button type="submit" variant="contained" color="primary" fullWidth>
        Login
      </Button>
    </Box>
  );
};

export default Login;
