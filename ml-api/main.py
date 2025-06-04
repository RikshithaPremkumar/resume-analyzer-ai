from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from parser import extract_text
from scorer import analyze_resume

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    job_description: str = Form("")  # ✅ New JD input
):
    contents = await file.read()
    text = extract_text(file.filename, contents)
    result = analyze_resume(text, job_description)
    return result
