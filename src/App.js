import React, { useRef, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import logo from './logo.svg';
import './App.css';

import getServer from 'config/server-url';

const nodeEnv = process.env.NODE_ENV;

const App = () => {
  const [serverGreeting, setServerGreeting] = useState('waiting for server response');
  const client = useRef();

  useEffect(() => {
    client.current = io(getServer());
    const socket = client.current;
    socket.on('connection-test', message => setServerGreeting(message));

    return () => {
      socket.close();
    }
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
        <p>Connection test: {serverGreeting}</p>
        <a className='App-link' href='https://reactjs.org' target='_blank' rel='noopener noreferrer'>
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;
