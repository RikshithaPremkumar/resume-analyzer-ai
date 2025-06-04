import React from "react";
import { Button, Container, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" style={{ textAlign: "center", marginTop: "10vh" }}>
      <Typography variant="h3" gutterBottom>
        AI Resume Analyzer & Job Matcher
      </Typography>
      <Typography variant="body1" gutterBottom>
        Upload your resume and get matched with your ideal job using the power of AI.
      </Typography>
      <Stack direction="row" spacing={3} justifyContent="center" marginTop={4}>
        <Button variant="contained" onClick={() => navigate("/upload")}>
          Upload Resume
        </Button>
        <Button variant="outlined" onClick={() => navigate("/suggestions")}>
          View Suggestions
        </Button>
      </Stack>
    </Container>
  );
};

export default Home;
