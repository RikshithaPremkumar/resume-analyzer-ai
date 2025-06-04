import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";

const History = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/resume/history", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(data => setEntries(data));
  }, []);

  return (
    <Container maxWidth="md" style={{ marginTop: "5vh" }}>
      <Typography variant="h4" gutterBottom>
        Resume History
      </Typography>

      {entries.map((entry, idx) => (
        <Paper key={idx} style={{ padding: "1rem", marginBottom: "1rem" }}>
          <Typography variant="h6">{entry.filename}</Typography>
          <List>
            {Object.entries(entry.match_scores).map(([role, score]) => (
              <ListItem key={role}>
                <ListItemText primary={`${role}: ${score}`} />
              </ListItem>
            ))}
          </List>
          <Typography variant="subtitle2">Feedback:</Typography>
          <Typography variant="body2">{entry.feedback}</Typography>
        </Paper>
      ))}
    </Container>
  );
};

export default History;
