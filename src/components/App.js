import React, { useRef, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import getServer from 'config/server-url';

import 'components/App.scss';

// components

import Header from 'components/Header';
import Conversations from 'components/Conversations';
import Chat from 'components/Chat';
import Users from 'components/Users';

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
    <div className='app'>
      <Header />
      <Conversations />
      <Chat />
      <Users userlist={userlist} />
    </div>
  );
};

export default App;
