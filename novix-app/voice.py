import speech_recognition as sr
from gtts import gTTS
import os
import time

class VoiceEngine:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()
        self.wake_words = ["chat", "instruct"]
        self.is_listening = False
        
    def listen(self, timeout=5):
        with self.microphone as source:
            print("Calibrating microphone...")
            self.recognizer.adjust_for_ambient_noise(source)
            
        while True:
            try:
                audio = self.recognizer.listen(source, timeout=timeout)
                text = self.recognizer.recognize_google(audio).lower()
                
                if any(word in text for word in self.wake_words):
                    self.is_listening = True
                    self.speak("How can I assist you?")
                    continue
                
                if self.is_listening:
                    response = self.process_command(text)
                    self.speak(response)
                    self.is_listening = False
                    
            except sr.WaitTimeoutError:
                continue
            except sr.UnknownValueError:
                self.speak("Could not understand audio")
            except Exception as e:
                print(f"Error: {str(e)}")
    
    def process_command(self, text: str) -> str:
        # Integrate with ChatAgent
        return "This is a voice response to: " + text
    
    def speak(self, text: str):
        tts = gTTS(text=text, lang='en')
        tts.save("response.mp3")
        os.system("mpg321 response.mp3")  # Linux/macOS
