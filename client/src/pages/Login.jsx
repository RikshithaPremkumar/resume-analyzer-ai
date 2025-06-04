import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: "10vh" }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth />
        <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth />
        <Button variant="contained" onClick={handleSubmit}>Login</Button>
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </Container>
  );
};

export default Login;
