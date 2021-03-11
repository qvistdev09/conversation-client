import React, { useRef, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import getServer from 'config/server-url';

import 'components/App.scss';

// components

import Header from 'components/Header';
import User from 'components/Header-User';
import UserIcon from 'components/UserIcon';
import Conversations from 'components/Conversations';
import AddChannelBtn from 'components/Conversations-Add-Channel-Btn';
import Chat from 'components/Chat';
import ChatContent from 'components/Chat-Content';
import Users from 'components/Users';

const App = () => {
  const [userlist, setUserlist] = useState([]);
  const [channelList, setChannelList] = useState([]);
  const [activeConversation, setActiveConversation] = useState(0);
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState();
  const [usersTyping, setUsersTyping] = useState([]);
  const client = useRef();

  useEffect(() => {
    client.current = io(getServer());
    const socket = client.current;
    socket.on('user-list', usersArray => setUserlist(usersArray));
    socket.on('channel-list', channelsArray => setChannelList(channelsArray));
    socket.on('channel-message', messagesArray => setMessages(messagesArray));
    socket.on('user-id', receivedId => setUserId(receivedId));
    socket.on('users-typing', usersTypingArray => setUsersTyping(usersTypingArray));

    return () => {
      socket.close();
    };
  }, []);

  const send = message => {
    if (userId !== undefined) {
      client.current.emit('message', { text: message, id: activeConversation, by: userId });
    }
  };

  const emitActiveConversation = id => {
    setActiveConversation(id);
    client.current.emit('set-active', id);
  };

  const createChannel = label => {
    client.current.emit('create-channel', label);
  };

  const setUserName = newUsername => {
    client.current.emit('update-name', newUsername);
  };

  const getName = id => {
    const match = userlist.find(user => user.pubId === id);
    return match ? match.name : 'Missing';
  };

  const getColor = id => {
    const match = userlist.find(user => user.pubId === id);
    return match ? match.color : '#89f0a4';
  };

  const getIcon = id => {
    const match = userlist.find(user => user.pubId === id);
    if (match && match.icon) {
      return match.icon;
    }
    return '0';
  };

  const alertTyping = () => {
    client.current.emit('is-typing');
  };

  const formatTypingAlert = () => {
    const filtered = usersTyping.filter(id => id !== userId);
    if (filtered.length === 1) {
      return `${getName(filtered[0])} is typing`;
    }
    if (filtered.length < 3) {
      let alert = '';
      filtered.forEach((user, index) => {
        if (index !== filtered.length - 1) {
          alert += `${getName(user)}, `;
        } else {
          alert += `and ${getName(user)} are typing`;
        }
      });
      return alert;
    }
    return 'Several people are typing';
  };

  const currentChannel = () => {
    const current = channelList.find(channel => channel.id === activeConversation);
    return current ? current.label : 'loading...';
  };

  return (
    <div className='app'>
      <Header>
        <User userName={getName(userId)} setUserName={setUserName}>
          <UserIcon icon={getIcon(userId)} background={getColor(userId)} status />
        </User>
      </Header>
      <Conversations
        channelList={channelList}
        emitActiveConversation={emitActiveConversation}
        activeConversation={activeConversation}
      >
        <AddChannelBtn createChannel={createChannel} />
      </Conversations>
      <Chat
        send={send}
        messages={messages}
        alertTyping={alertTyping}
        usersTyping={formatTypingAlert()}
        currentChannel={currentChannel()}
      >
        {messages.map(messageObj => (
          <ChatContent user={getName(messageObj.by)} messageObj={messageObj} key={messageObj.id}>
            <UserIcon icon={getIcon(messageObj.by)} size='2.3rem' margin='0' background={getColor(messageObj.by)} />
          </ChatContent>
        ))}
      </Chat>
      <Users userlist={userlist.filter(user => user.online)} />
    </div>
  );
};

export default App;
