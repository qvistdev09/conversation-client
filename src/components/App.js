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
  const [channelList, setChannelList] = useState([]);
  const client = useRef();

  useEffect(() => {
    client.current = io(getServer());
    const socket = client.current;
    socket.on('user-list', usersArray => setUserlist(usersArray));
    socket.on('channel-list', channelsArray => setChannelList(channelsArray));

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className='app'>
      <Header />
      <Conversations channelList={channelList} />
      <Chat />
      <Users userlist={userlist} />
    </div>
  );
};

export default App;
