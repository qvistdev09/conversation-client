import React, { useRef, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import logo from './logo.svg';
import './App.css';

import getServer from 'config/server-url';

const nodeEnv = process.env.NODE_ENV;

const App = () => {
  const [userlist, setUserlist] = useState([]);
  const client = useRef();

  useEffect(() => {
    client.current = io(getServer());
    const socket = client.current;
    socket.on('userlist', usersArray => setUserlist(usersArray));

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>The node environment is: {nodeEnv}</p>
        <p>The server is: {getServer()}</p>
        <h2>Connected:</h2>
        {userlist.map(user => (
          <p key={user.pubId}>{user.name}</p>
        ))}
      </header>
    </div>
  );
};

export default App;
