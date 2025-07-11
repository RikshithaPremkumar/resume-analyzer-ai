import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }} onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>
          Resume AI
        </Typography>

        {user ? (
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body1">{user.name}</Typography>
            <Button color="inherit" onClick={() => navigate("/upload")}>Upload</Button>
            <Button color="inherit" onClick={() => navigate("/history")}>History</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
            <Button color="inherit" onClick={() => navigate("/register")}>Register</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
