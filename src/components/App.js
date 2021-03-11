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
  const [activeConversation, setActiveConversation] = useState(0);
  const [messages, setMessages] = useState([]);
  const client = useRef();

  useEffect(() => {
    client.current = io(getServer());
    const socket = client.current;
    socket.on('user-list', usersArray => setUserlist(usersArray));
    socket.on('channel-list', channelsArray => setChannelList(channelsArray));
    socket.on('channel-message', messagesArray => setMessages(messagesArray));

    return () => {
      socket.close();
    };
  }, []);

  const send = message => {
    client.current.emit('message', { text: message, id: activeConversation });
  };

  return (
    <div className='app'>
      <Header />
      <Conversations
        channelList={channelList}
        setActiveConversation={setActiveConversation}
        activeConversation={activeConversation}
      />
      <Chat send={send} messages={messages} />
      <Users userlist={userlist} />
    </div>
  );
};

export default App;
