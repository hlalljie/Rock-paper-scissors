import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');  // Connect to your backend server
let messagesLoaded = false;

const ChatComponent = () => {
  const [message, setMessage] = useState('');
  // get chat history when component mounts
  const [chatHistory, setChatHistory] = useState([]);
  //const [chatHistory, setChatHistory] = useState([]);

  const [username, setUsername] = useState('User' + Math.floor(Math.random() * 1000));  // Generate a random username
  // function to get chat history from backend server at localhost:3000/chatHistory
  

  useEffect(() => {

    async function getChatHistory(){
      console.log("Getting chat history");
      try {
          const response = await fetch('http://localhost:3000/chatHistory');
          const data = await response.json();
          
          // map data to an array of username, message objects
          let historyList = data.map((item) => ({ username: item.username, message: item.message }));
          console.log(historyList);
          setChatHistory([...chatHistory, ...data]);
      } catch (error) {
          // Handle any errors
          console.error(error);
          return;
      }
    }
    if (messagesLoaded === false) {
      getChatHistory();
      messagesLoaded = true;
    }

    // Listener for 'chat' event
    socket.on('chat', (data) => {
    const updatedHistory = [...chatHistory, data];
      setChatHistory([...chatHistory, data]);
      console.log('Updated History:', updatedHistory);  
    });
  }, [chatHistory]);


  const sendMessage = () => {
    socket.emit('chat', { username, message });  // Use the random username
    setMessage('');
  };
  console.log('Current UI state:', chatHistory);  // Debug line
  return (
    <div>
      <div>
        {chatHistory.map((data, index) => (
          <div key={index}>
            <strong>{data.username}:</strong> {data.message}
          </div>
        ))}
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatComponent;