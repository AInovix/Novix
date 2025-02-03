from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
import docker
import httpx

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

PROVIDERS = {
    "openai": {
        "endpoint": "https://api.openai.com/v1/chat/completions",
        "headers": {"Authorization": f"Bearer {API_KEY}"}
    },
    "anthropic": {
        "endpoint": "https://api.anthropic.com/v1/complete",
        "headers": {"x-api-key": API_KEY}
    },
    "google-gemini": {
        "endpoint": "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
        "headers": {"x-goog-api-key": API_KEY}
    },
    "cohere": {
        "endpoint": "https://api.cohere.ai/v1/generate",
        "headers": {"Authorization": f"Bearer {API_KEY}"}
    },
    "huggingface": {
        "endpoint": "https://api-inference.huggingface.co/models/{model}",
        "headers": {"Authorization": f"Bearer {API_KEY}"}
    },
    "stabilityai": {
        "endpoint": "https://api.stability.ai/v1/generation/{engine}/text-to-image",
        "headers": {"Authorization": f"Bearer {API_KEY}"}
    },
    "deepseek": {
        "endpoint": "https://api.deepseek.com/v1/chat/completions",
        "headers": {"Authorization": f"Bearer {API_KEY}"}
    },
    "mistral": {
        "endpoint": "https://api.mistral.ai/v1/chat/completions",
        "headers": {"Authorization": f"Bearer {API_KEY}"}
    },
    "perplexity": {
        "endpoint": "https://api.perplexity.ai/v1/chat/completions",
        "headers": {"Authorization": f"Bearer {API_KEY}"}
    },
    "groq": {
        "endpoint": "https://api.groq.com/v1/chat/completions",
        "headers": {"Authorization": f"Bearer {API_KEY}"}
    },
    "alephalpha": {
        "endpoint": "https://api.aleph-alpha.com/v1/complete",
        "headers": {"Authorization": f"Bearer {API_KEY}"}
    },
    "nlpcloud": {
        "endpoint": "https://api.nlpcloud.com/v1/{model}/generation",
        "headers": {"Authorization": f"Bearer {API_KEY}"}
    }
}

class ExecutionRequest(BaseModel):
    code: str
    language: str = "python"
    provider: str
    model: str = "default"

@app.post("/execute")
async def execute_code(request: ExecutionRequest, token: str = Depends(oauth2_scheme)):
    # Authentication and validation logic
    provider_config = PROVIDERS.get(request.provider)
    if not provider_config:
        raise HTTPException(status_code=400, detail="Invalid provider")
    
    # Secure code execution
    client = docker.from_env()
    try:
        result = client.containers.run(
            f"{request.language}-sandbox",
            command=request.code,
            remove=True,
            mem_limit="100m",
            network_mode="none"
        )
    except docker.errors.ContainerError as e:
        return {"error": str(e)}
    
    # AI processing
    endpoint = provider_config["endpoint"].format(model=request.model)
    async with httpx.AsyncClient() as client:
        response = await client.post(
            endpoint,
            json={"prompt": result.decode()},
            headers=provider_config["headers"]
        )
    
    return {
        "result": response.json(),
        "logs": result.decode(),
        "provider": request.provider
    }
