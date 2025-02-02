# novix/chatbot.py
import json
import os
from datetime import datetime
from collections import deque

class ChatAgent:
    def __init__(self, context_length=5):
        self.conversation_history = deque(maxlen=context_length)
        self.conversation_dir = "Novix/conversations"
        os.makedirs(self.conversation_dir, exist_ok=True)
        
    def chat(self, message: str) -> str:
        # Add timestamp to message
        timestamp = datetime.now().isoformat()
        entry = {
            "timestamp": timestamp,
            "message": message,
            "context": list(self.conversation_history)
        }
        
        # Process message (replace with actual AI integration)
        response = self.generate_response(message)
        
        # Update history
        self.conversation_history.append({"user": message, "bot": response})
        self.save_conversation()
        
        return response
    
    def generate_response(self, message: str) -> str:
        """Integrate with Novix AI engine here"""
        # Example simple response logic
        if "hello" in message.lower():
            return "Hello! How can I assist you today?"
        return "I'm still learning. Could you please elaborate?"
    
    def save_conversation(self):
        filename = f"{self.conversation_dir}/conversation_{datetime.now().strftime('%Y%m%d%H%M')}.json"
        with open(filename, 'w') as f:
            json.dump(list(self.conversation_history), f)
    
    def load_conversation(self, filepath: str):
        with open(filepath, 'r') as f:
            self.conversation_history = deque(json.load(f), maxlen=5)

# Streamlit Web UI (app.py)
import streamlit as st

def chat_interface():
    st.title("Novix Chat Interface")
    
    if "chat_agent" not in st.session_state:
        st.session_state.chat_agent = ChatAgent()
        st.session_state.messages = []
    
    user_input = st.text_input("Type your message:")
    
    if user_input:
        response = st.session_state.chat_agent.chat(user_input)
        st.session_state.messages.append({"user": user_input, "bot": response})
    
    for msg in st.session_state.messages:
        st.markdown(f"**You:** {msg['user']}")
        st.markdown(f"**Novix:** {msg['bot']}")
        st.markdown("---")

if __name__ == "__main__":
    chat_interface()
