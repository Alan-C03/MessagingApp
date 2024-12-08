import React, { useState, useEffect } from 'react';
import { ref, onValue, push } from "firebase/database";
import { db } from "../services/firebase";

const ChatRoom = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
  const messagesRef = ref(db, "messages"); 

  const unsubscribe = onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const loadedMessages = Object.values(data); 
      setMessages(loadedMessages); 
    } else {
      setMessages([]); 
    }
  });

  return () => unsubscribe(); 
}, []); 

  const handleSendMessage = () => {
  console.log("HandleSendMessage called");

  const messagesRef = ref(db, "messages"); 
  const message = {
    text: newMessage,
    sender: user.displayName,
    timestamp: new Date().toISOString()
  };

  console.log("Attempting to push message:", message);

  push(messagesRef, message)
    .then(() => {
      console.log("Message successfully sent");
    })
    .catch((error) => {
      console.error("Error sending message:", error);
    });

  setNewMessage(""); 
};

  

  return (
    <div>
      <h3>Chat Room</h3>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <b>{msg.sender}: </b>
            {msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatRoom;


