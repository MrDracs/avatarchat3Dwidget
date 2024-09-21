import React, { useState, useEffect } from "react";
import "./templates/dynamic/style.css"; // Define the image path here
  
const SpeechComponent = ({ onTextSubmit}) => {
  const [isListening, setIsListening] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const micImg = "/asset/images/mic.png";
  const sendImg = "/asset/images/send.png";
  let recognition;

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          }
        }
        setChatMessage(finalTranscript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isListening) {
          recognition.start();
        }
      };
    }
  }, [isListening]);

  // Start/stop speech recognition
  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleSendClick = () => {
    if (chatMessage.trim()) {
      onTextSubmit(chatMessage); // Call the parent function to submit the text // Call the TTS function
      setChatMessage("");
    }
  };

  return (
    <div id="inputArea">
      <input
        id="chatbox"
        type="text"
        value={chatMessage}
        onChange={(e) => setChatMessage(e.target.value)}
        placeholder="Hi there! Type here or use the mic."
      />
      <button id="startStopButton" onClick={toggleListening}>
        <img src={micImg} id="mic" alt="mic" />
      </button>
      <button id="sendButton" onClick={handleSendClick}>
      <img src={sendImg} id="send" alt="send" />
      </button>
    </div>
  );
};

export default SpeechComponent;
