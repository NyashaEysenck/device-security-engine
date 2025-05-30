import json
import google.generativeai as genai
import re
from config import Config
from fastapi import HTTPException

genai.configure(api_key=Config.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

def clean_gemini_response(response_text: str) -> str:
    """Clean Gemini response by removing markdown/code blocks and leading 'json' labels, and ensure output starts with '{'."""
    import re
    # Remove code block markers
    if response_text.startswith("```json") and response_text.endswith("```"):
        response_text = response_text[7:-3].strip()
    elif response_text.startswith("```") and response_text.endswith("```"):
        response_text = response_text[3:-3].strip()
    # Remove leading 'json' label and all whitespace/newlines after it
    response_text = re.sub(r"^\s*json\s*", "", response_text, flags=re.IGNORECASE)
    # Ensure we start at the first '{'
    idx = response_text.find('{')
    if idx != -1:
        response_text = response_text[idx:]
    return response_text

def classify_url_gemini(url: str) -> tuple[bool, float, str | None]:
    prompt = f"""
    You are a cybersecurity assistant. Analyze this URL for potential threats.
    IMPORTANT: Respond ONLY with a valid JSON object, no markdown, no commentary, no code blocks, no explanation, no text before or after. The JSON must have exactly these fields:
      - isMalicious (boolean)
      - confidence (float between 0 and 1)
      - reason (string explaining your assessment)
    For example: {{\n  \"isMalicious\": true,\n  \"confidence\": 0.9,\n  \"reason\": \"This is a suspicious domain...\"\n}}
    URL: {url}
    """
    
    try:
        response = model.generate_content(prompt)
        
        # Extract the text response
        response_text = response.text
        
        # Clean the response by removing markdown code block markers if present
        response_text = clean_gemini_response(response_text)
        # Remove any leading/trailing whitespace or newlines
        response_text = response_text.strip()
        # Remove leading/trailing backticks or code block remnants
        if response_text.startswith('```'):
            response_text = response_text.lstrip('`').strip()
        if response_text.endswith('```'):
            response_text = response_text.rstrip('`').strip()
        
        # Try to parse the response as JSON
        try:
            import json
            result = json.loads(response_text)
            return (
                result.get("isMalicious", False),
                float(result.get("confidence", 0.5)),
                result.get("reason", "No specific threat detected")
            )
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON: {e}\nResponse text: {response_text}")
            # Fallback to simple classification
            if "malicious" in response_text.lower():
                return True, 0.85, "AI detected potential malicious patterns"
            return False, 0.90, "No obvious threats detected"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI model error: {str(e)}")

def classify_email_gemini(email_text: str) -> tuple[bool, float, list[str]]:
    prompt = f"""
    You are a cybersecurity expert analyzing an email for phishing attempts.
    IMPORTANT: Respond ONLY with a valid JSON object, no markdown, no commentary, no code blocks, no explanation, no text before or after. The JSON must have exactly these fields:
      - isPhishing (boolean)
      - confidence (float between 0 and 1)
      - reasons (array of strings explaining red flags found)
    For example: {{\n  \"isPhishing\": true,\n  \"confidence\": 0.8,\n  \"reasons\": [\"Urgent language\", \"Suspicious link\"]\n}}
    Email Content: {email_text}
    """
    
    try:
        response = model.generate_content(prompt)
        response_text = clean_gemini_response(response.text)
        
        # Remove any leading/trailing whitespace or newlines
        response_text = response_text.strip()
        # Remove leading/trailing backticks or code block remnants
        if response_text.startswith('```'):
            response_text = response_text.lstrip('`').strip()
        if response_text.endswith('```'):
            response_text = response_text.rstrip('`').strip()
        
        try:
            result = json.loads(response_text)
            return (
                result.get("isPhishing", False),
                float(result.get("confidence", 0.5)),
                result.get("reasons", ["No specific red flags detected"])
            )
        except json.JSONDecodeError:
            # Fallback analysis if JSON parsing fails
            if "phishing" in response_text.lower():
                return True, 0.85, ["AI detected potential phishing patterns"]
            return False, 0.90, ["No obvious phishing patterns detected"]
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI model error: {str(e)}")
