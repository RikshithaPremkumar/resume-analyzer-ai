import pdfplumber
import docx2txt
import tempfile

def extract_text(filename, content):
    ext = filename.split(".")[-1].lower()

    # Create a temporary file with correct extension
    with tempfile.NamedTemporaryFile(delete=False, suffix="." + ext) as temp:
        temp.write(content)
        temp_path = temp.name

    # Extract text from PDF
    if ext == "pdf":
        try:
            with pdfplumber.open(temp_path) as pdf:
                text = "\n".join(
                    page.extract_text() or "" for page in pdf.pages
                )
        except Exception as e:
            print(f"PDF extract error: {e}")
            text = ""
    
    # Extract text from DOCX/DOC
    elif ext in ["doc", "docx"]:
        try:
            text = docx2txt.process(temp_path)
        except Exception as e:
            print(f"DOCX extract error: {e}")
            text = ""

    else:
        text = ""

    return text
