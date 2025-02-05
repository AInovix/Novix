from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import openai
import anthropic

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

PROVIDERS = {
    "openai": openai.ChatCompletion.create,
    "anthropic": anthropic.Anthropic().messages.create,
    # Add other providers
}

@app.post("/api/chat")
async def chat_endpoint(request: dict):
    provider = select_provider(request.get('provider', 'openai'))
    
    try:
        response = provider(
            model=request.get('model', 'gpt-4'),
            messages=[{"role": "user", "content": request['prompt']}],
            max_tokens=1000
        )
        return {"response": format_response(response)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def select_provider(name: str):
    return PROVIDERS.get(name.lower(), PROVIDERS['openai'])

def format_response(response):
    # Convert API response to markdown
    if hasattr(response, 'choices'):
        return response.choices[0].message.content
    elif hasattr(response, 'content'):
        return response.content[0].text
    return str(response)
