import React, { useRef, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import getServer from 'config/server-url';

import 'components/App.scss';

// components

import Header from 'components/Header';
import User from 'components/Header-User';
import Conversations from 'components/Conversations';
import AddChannelBtn from 'components/Conversations-Add-Channel-Btn';
import Chat from 'components/Chat';
import Users from 'components/Users';

const App = () => {
  const [userlist, setUserlist] = useState([]);
  const [channelList, setChannelList] = useState([]);
  const [activeConversation, setActiveConversation] = useState(0);
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState();
  const client = useRef();

  useEffect(() => {
    client.current = io(getServer());
    const socket = client.current;
    socket.on('user-list', usersArray => setUserlist(usersArray));
    socket.on('channel-list', channelsArray => setChannelList(channelsArray));
    socket.on('channel-message', messagesArray => setMessages(messagesArray));
    socket.on('user-id', receivedId => setUserId(receivedId));

    return () => {
      socket.close();
    };
  }, []);

  const send = message => {
    client.current.emit('message', { text: message, id: activeConversation });
  };

  const emitActiveConversation = id => {
    setActiveConversation(id);
    client.current.emit('set-active', id);
  };

  const createChannel = label => {
    client.current.emit('create-channel', label);
  };

  const getName = id => {
    const match = userlist.find(user => user.pubId === id);
    return match ? match.name : 'Missing userinfo';
  };

  return (
    <div className='app'>
      <Header>
        <User userName={getName(userId)} />
      </Header>
      <Conversations
        channelList={channelList}
        emitActiveConversation={emitActiveConversation}
        activeConversation={activeConversation}
      >
        <AddChannelBtn createChannel={createChannel} />
      </Conversations>
      <Chat send={send} messages={messages} />
      <Users userlist={userlist} />
    </div>
  );
};

export default App;
