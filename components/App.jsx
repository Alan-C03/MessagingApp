import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import ChatRoom from './ChatRoom';
import Login from './Login';
import UserProfile from './UserProfile';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => setUser(user));
  }, []);

  return (
    <div>
      <h1>Real-Time Chat App</h1>
      {!user ? (
        <Login />
      ) : (
        <div>
          <UserProfile user={user} />
          <ChatRoom user={user} />
        </div>
      )}
    </div>
  );
};

export default App;
