import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Link, Grid } from "@mui/material";
import "./main.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <Box
      className="login-container"
      component="form"
      onSubmit={handleLogin}
      noValidate
      autoComplete="off"
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 300, 
        padding: 3, 
        backgroundColor: "#f0f0f0", 
        borderRadius: 8, 
        boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)", 
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "#1976D2" }}> 
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5" color={"#333333"}> 
        Sign in
      </Typography>

      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ width: "100%", mt: 2 }} 
      />

      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ width: "100%", mt: 2 }} 
      />

      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
        SignIn
      </Button>
    </Box>
  );
};

export default Login;
