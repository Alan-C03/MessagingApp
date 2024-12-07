import React from 'react';
import { signOut } from '../services/auth';

const UserProfile = ({ user }) => {
  return (
    <div>
      <img src={user.photoURL} alt="avatar" />
      <h2>{user.displayName}</h2>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

export default UserProfile;
