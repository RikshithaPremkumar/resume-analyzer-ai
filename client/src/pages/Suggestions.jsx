import React from "react";
import { Container, Typography } from "@mui/material";

const Suggestions = () => {
  return (
    <Container maxWidth="md" style={{ marginTop: "10vh", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Job Role Suggestions
      </Typography>
      <Typography variant="body1">
        Your matched jobs will appear here after you upload a resume.
      </Typography>
    </Container>
  );
};

export default Suggestions;
