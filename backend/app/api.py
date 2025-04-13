from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from groq import Groq

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    expose_headers=["*"],
)

# Initialize Groq client
client = Groq(api_key="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")  # Replace with valid key

class ChatRequest(BaseModel):
    message: str

@app.options("/chat")
async def options_chat():
    headers = {
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
    }
    return JSONResponse(content={"status": "ok"}, headers=headers)

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    headers = {
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Credentials": "true",
    }
    try:
        completion = client.chat.completions.create(
            messages=[{"role": "user", "content": request.message}],
            model="llama-3.1-8b-instant",
        )
        return JSONResponse(
            content={"reply": completion.choices[0].message.content},
            headers=headers
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Groq API Error: {str(e)}",
            headers=headers
        )