from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import openai
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

openai.api_key = os.getenv("OPENAI_API_KEY")

@app.post("/execute")
async def execute_code(request: dict):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{
                "role": "user",
                "content": f"Execute this code and explain:\n{request['code']}"
            }]
        )
        return {
            "result": response.choices[0].message.content,
            "usage": response.usage.dict()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
