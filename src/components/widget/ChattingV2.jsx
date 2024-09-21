import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SpeechComponent from "../../SpeechComponent";
import { useParams } from "react-router-dom";
import "./style.css";

const ChattingV2 = () => {
  const chatbotId = useParams().chatbotId;
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTalking, setIsTalking] = useState(false); // Track avatar animation
  const chatWindowRef = useRef(null);
  const [chatbotConfig, setChatbotConfig] = useState(null);
  const supportImg = "/asset/images/support2.png"; 

  useEffect(() => {
    const fetchChatbotConfig = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/chatbots/${chatbotId}/config`);
        setChatbotConfig(response.data);
      } catch (error) {
        setError('Error fetching chatbot configuration');
      }
    };

    fetchChatbotConfig();
  }, [chatbotId]);

  useEffect(() => {
    // Auto-scroll to the latest message
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);

    const updatedHistory = [...chatHistory, { role: "user", content: message }];
    setChatHistory(updatedHistory);

    try {
      const response = await axios.post(`http://localhost:5000/api/chat/${chatbotId}/v2`, {
        message,
        previousMessages: updatedHistory,
      });

      const botResponses = response.data.messages; // This is now an array of messages

      // Process each bot response
      const newMessages = botResponses.map((botResponse) => {
        return {
          role: "assistant",
          content: JSON.stringify(botResponse), // Store the whole object
        };
      });

      // Update chat history with both new bot messages
      setChatHistory([...updatedHistory, ...newMessages]);


      // Trigger avatar animation
      setIsTalking(true);
      setTimeout(() => {
        setIsTalking(false);
      }, 3000); // Animation duration
    } catch (error) {
      setError(`Error sending message to the chatbot: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg">
      <div id="headerbox">
        <h1 id="headerr"><span id="title">{chatbotConfig ? chatbotConfig.name : 'Chatbot'}</span></h1>
        <div id="bodybox">
          <div id="AgentModel">
            <iframe id="suuport" src="http://localhost:5173/" />
          </div>
          <div id="line">&nbsp;</div>
          <div id="chatborder" ref={chatWindowRef}>
            {chatHistory.map((chat, index) => (
              <div key={index} className={chat.role === "user" ? "user" : "bot"}>
                {chat.role === "user" ? `${chat.content}` : JSON.parse(chat.content).text}
              </div>
            ))}
            {isLoading && <p>Loading...</p>}
          </div>
        </div>

        {/* Speech Component */}
        <SpeechComponent onTextSubmit={sendMessage} />

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default ChattingV2;
