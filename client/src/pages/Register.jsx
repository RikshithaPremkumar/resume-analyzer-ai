import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        setSuccess("Registered successfully. You can login now.");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: "10vh" }}>
      <Typography variant="h4" gutterBottom>Register</Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth />
        <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth />
        <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth />
        <Button variant="contained" onClick={handleSubmit}>Register</Button>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </Box>
    </Container>
  );
};

export default Register;
