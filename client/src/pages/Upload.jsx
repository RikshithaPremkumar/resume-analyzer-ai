import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Input,
  Alert,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  TextField
} from "@mui/material";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ Import like this, not as a side-effect




const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [message, setMessage] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setMessage("");
    setAnalysis(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select a resume file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", selectedFile);
    formData.append("job_description", jobDescription);

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/resume/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        setMessage(result.message);
        setAnalysis(result.analysis);
      } else {
        setMessage(result.error || "Upload failed.");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const renderScoreBar = (label, value) => (
    <Box key={label} mb={2}>
      <Typography variant="subtitle2">{label}</Typography>
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{ height: 10, borderRadius: 5 }}
      />
      <Typography variant="caption">{value}%</Typography>
    </Box>
  );


const generatePDF = () => {
  if (!analysis) return;

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Resume Analysis Report", 14, 20);

  doc.setFontSize(12);
  doc.text(`Filename: ${selectedFile?.name || "Resume"}`, 14, 30);
  doc.text(`Overall Score: ${analysis.overall_score}%`, 14, 40);

  autoTable(doc, {
    startY: 50,
    head: [["Category", "Score"]],
    body: Object.entries(analysis.score_breakdown || {}).map(([label, score]) => [
      label,
      `${score}%`,
    ]),
  });

  let y = doc.lastAutoTable.finalY + 10;
  doc.text("Suggestions:", 14, y);
  analysis.suggestions.forEach((tip, i) => {
    doc.text(`- ${tip}`, 16, y + 10 + i * 7);
  });

  doc.save("resume_analysis_report.pdf");
};


  return (
    <Container maxWidth="md" style={{ marginTop: "5vh" }}>
      <Typography variant="h4" gutterBottom>
        Upload Your Resume
      </Typography>

      <Box mt={2}>
        <Input
          type="file"
          inputProps={{ accept: ".pdf,.doc,.docx" }}
          onChange={handleFileChange}
        />
      </Box>

      <Box mt={3}>
        <TextField
          multiline
          minRows={4}
          fullWidth
          label="Paste Job Description (optional)"
          variant="outlined"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </Box>

      {selectedFile && (
        <Typography variant="body2" style={{ marginTop: "1rem" }}>
          Selected: {selectedFile.name}
        </Typography>
      )}

      <Box mt={3}>
        <Button variant="contained" onClick={handleUpload} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Upload"}
        </Button>
      </Box>

      {message && (
        <Alert severity="info" style={{ marginTop: "2rem" }}>
          {message}
        </Alert>
      )}

      {analysis && (
        <Paper elevation={3} style={{ marginTop: "2rem", padding: "1.5rem" }}>
          <Typography variant="h6">Resume Analysis Result</Typography>

          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Job Role Match</Typography>
              <List>
                {Object.entries(analysis.match_scores).map(([role, score]) => (
                  <ListItem key={role}>
                    <ListItemText primary={`${role}: ${score}`} />
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Score Breakdown</Typography>
              {renderScoreBar("Grammar", analysis.score_breakdown.Grammar)}
              {renderScoreBar("Buzzwords", analysis.score_breakdown.Buzzwords)}
              {renderScoreBar("Length/Structure", analysis.score_breakdown["Length/Structure"])}
            </Grid>
          </Grid>

          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Summary</Typography>
              <Typography variant="body2" color="textSecondary">
                {analysis.summary}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Feedback</Typography>
              <Typography variant="body1">{analysis.feedback}</Typography>
            </Grid>
          </Grid>

          <Box mt={3}>
            <Card sx={{ backgroundColor: "#f0f4ff", textAlign: "center" }}>
              <CardContent>
                <Typography variant="h5">Overall Resume Score</Typography>
                <Typography variant="h2" color="primary">
                  {analysis.overall_score}%
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {analysis.suggestions && (
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>Improvement Suggestions</Typography>
              <List>
                {analysis.suggestions.map((tip, idx) => (
                  <ListItem key={idx}>
                    <ListItemText primary={tip} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {analysis.keyword_match && (
            <Box mt={4}>
              <Typography variant="h6">Job Description Keyword Match</Typography>
              <Typography>Match Percentage: {analysis.keyword_match.percent}%</Typography>

              <Box mt={2}>
                <Typography variant="subtitle2">Matched Keywords:</Typography>
                <Typography variant="body2">
                  {analysis.keyword_match.matched.join(", ") || "None"}
                </Typography>
              </Box>

              <Box mt={2}>
                <Typography variant="subtitle2">Missing Keywords:</Typography>
                <Typography variant="body2" color="error">
                  {analysis.keyword_match.missing.join(", ") || "None"}
                </Typography>
              </Box>
            </Box>
          )}

          <Button
  variant="outlined"
  onClick={generatePDF}
  style={{ marginTop: "1.5rem" }}
>
  Download PDF Report
</Button>


        </Paper>
      )}
    </Container>
  );
};

export default Upload;
