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
with open("../groq_key.txt", "r") as file:
    api_key = file.readline().strip()
client = Groq(api_key=api_key)

# Define message structure for context-aware conversations
class Message(BaseModel):
    role: str  # "system", "user", or "assistant"
    content: str

class ChatRequest(BaseModel):
    messages: list[Message]  # Full conversation history

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
        # Prepare messages for Groq API
        groq_messages = [
            {"role": msg.role, "content": msg.content}
            for msg in request.messages
        ]

        # Add system message if first in conversation
        if not any(msg.role == "system" for msg in request.messages):
            groq_messages.insert(0, {
                "role": "system",
                "content": "You are a helpful AI assistant. Keep responses concise and relevant to the conversation context."
            })

        completion = client.chat.completions.create(
            messages=groq_messages,
            model="llama-3.1-8b-instant",
            temperature=0.7,
            max_tokens=1024
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
