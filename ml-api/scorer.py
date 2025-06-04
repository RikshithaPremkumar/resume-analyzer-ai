import spacy
import re
from nltk.corpus import stopwords

nlp = spacy.load("en_core_web_sm")
stop_words = set(stopwords.words("english"))

job_keywords = {
    "Data Scientist": ["python", "machine learning", "pandas", "tensorflow", "data analysis"],
    "Web Developer": ["html", "css", "javascript", "react", "node.js"],
    "Software Engineer": ["java", "c++", "algorithms", "system design", "oop"],
}

def clean_text(text):
    text = re.sub(r"[^A-Za-z0-9 ]+", " ", text)
    return " ".join([word.lower() for word in text.split() if word.lower() not in stop_words])

def grammar_score(text):
    doc = nlp(text)
    grammar_issues = sum(1 for sent in doc.sents if len(sent.text.split()) < 4)
    score = max(0, 100 - grammar_issues * 10)
    return min(score, 100)

def buzzword_score(text):
    buzzwords = ["motivated", "team player", "dynamic", "results-driven", "go-getter"]
    count = sum(1 for word in buzzwords if word in text.lower())
    return min(count * 20, 100)

def length_score(text):
    words = len(text.split())
    if words < 100:
        return 50
    elif words < 300:
        return 75
    else:
        return 100

def get_improvement_tips(text):
    tips = []

    if not any(char.isdigit() for char in text):
        tips.append("Add more quantifiable results, such as numbers or percentages.")

    if any(buzz in text.lower() for buzz in ["team player", "go-getter", "hard-working"]):
        tips.append("Avoid overused buzzwords like 'team player' or 'go-getter'.")

    lines = text.split("\n")
    long_bullets = [line for line in lines if len(line.split()) > 25]
    if len(long_bullets) > 3:
        tips.append("Break long bullet points into smaller chunks.")

    action_verbs = ["achieved", "led", "developed", "implemented", "created", "increased"]
    if not any(verb in text.lower() for verb in action_verbs):
        tips.append("Use more action verbs like 'implemented', 'created', or 'led'.")

    if not tips:
        tips.append("Your resume looks strong! Minor refinements may help even more.")

    return tips

def analyze_resume(text, job_description=""):
    cleaned = clean_text(text)
    doc = nlp(cleaned)
    tokens = [token.text for token in doc]

    # Match scores
    match_scores = {}
    for role, keywords in job_keywords.items():
        score = sum(1 for kw in keywords if kw in tokens)
        if score > 0:
            match_scores[role] = f"{score * 20}% match"

    score_breakdown = {
        "Grammar": grammar_score(text),
        "Buzzwords": buzzword_score(text),
        "Length/Structure": length_score(text)
    }

    overall_score = round(sum(score_breakdown.values()) / len(score_breakdown))
    feedback = "Great job!" if overall_score >= 80 else "Consider improving grammar and resume length."

    # Keyword match (if JD provided)
    jd_keywords = set(clean_text(job_description).split())
    resume_keywords = set(clean_text(text).split())
    matched_keywords = list(jd_keywords & resume_keywords)
    missing_keywords = list(jd_keywords - resume_keywords)
    match_percent = (
        round((len(matched_keywords) / len(jd_keywords)) * 100)
        if jd_keywords else 0
    )

    return {
        "match_scores": match_scores,
        "summary": doc[:50].text,
        "feedback": feedback,
        "score_breakdown": score_breakdown,
        "overall_score": overall_score,
        "suggestions": get_improvement_tips(text),
        "keyword_match": {
            "percent": match_percent,
            "matched": matched_keywords,
            "missing": missing_keywords,
        },
    }
