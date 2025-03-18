import speech_recognition as sr
recognizer = sr.Recognizer()
with sr.Microphone() as source:
    audio = recognizer.listen(source)
    text = recognizer.recognize(audio)
    if text == "say hello":
        print("Hello, sir!")