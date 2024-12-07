import React from 'react';
import { signInWithGoogle } from '../services/auth';

const Login = () => {
  return (
    <div>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
};

export default Login;
