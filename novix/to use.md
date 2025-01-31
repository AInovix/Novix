## To use the chatbot:

1. **Start the services:**

```bash
docker-compose up
```
2. **Access interfaces:**

*Chat UI: http://localhost:8501

*Voice API: Use the VoiceEngine class in your code

Example usage in code:

```python
from novix.chatbot import ChatAgent
from novix.voice import VoiceEngine

# Text Chat
agent = ChatAgent()
print(agent.chat("Hello! What's the weather today?"))

# Voice Interaction
engine = VoiceEngine()
engine.listen(wake_words=["novix", "assistant"])
```
