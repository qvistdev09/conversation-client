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
import Footer from 'components/Footer';

import { getFromCache, saveInCache } from 'data-handling/cache';

const App = () => {
  const [userlist, setUserlist] = useState([]);
  const [channelList, setChannelList] = useState([]);
  const [activeConversation, setActiveConversation] = useState(0);
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState();
  const [usersTyping, setUsersTyping] = useState([]);
  const [newMessages, setNewMessages] = useState([]);
  const client = useRef();

  const handleNewMessage = channelId => {
    setNewMessages(previous => {
      const matched = previous.find(entry => entry.id === channelId);
      if (matched) {
        return previous.map(entry => (entry.id === channelId ? { ...entry, new: entry.new + 1 } : entry));
      }
      return [...previous, { id: channelId, new: 1 }];
    });
  };

  const retrieveMessage = (channelId, messageId) =>
    new Promise(resolve => {
      client.current.emit('need-message', channelId, messageId, messageObj => {
        resolve(messageObj);
      });
    });

  const constructMessages = async (sequence, channelId, retrieveMessage) => {
    const sequenceArray = sequence
      .split('-')
      .filter(str => str !== '')
      .map(nr => parseInt(nr, 10));
    const stagedMessages = [];
    for (let identifier of sequenceArray) {
      const cachedMessage = getFromCache(channelId, identifier);
      if (cachedMessage) {
        console.log('picked message from cache');
        stagedMessages.push(cachedMessage);
      } else {
        console.log('asked server for message');
        const retrieved = await retrieveMessage(channelId, identifier);
        saveInCache(channelId, retrieved);
        stagedMessages.push(retrieved);
      }
    }
    setMessages(stagedMessages);
  };

  useEffect(() => {
    client.current = io(getServer());
    const socket = client.current;
    socket.on('user-list', usersArray => setUserlist(usersArray));
    socket.on('channel-list', channelsArray => setChannelList(channelsArray));
    socket.on('user-id', receivedId => setUserId(receivedId));
    socket.on('users-typing', usersTypingArray => setUsersTyping(usersTypingArray));
    socket.on('new-channel-message', handleNewMessage);
    socket.on('new-sequence', (sequence, channelId) => constructMessages(sequence, channelId, retrieveMessage));

    return () => {
      socket.close();
    };
  }, []);

  const send = message => {
    client.current.emit('channel-message', message);
  };

  const clearNew = id => {
    setNewMessages(previous => {
      const match = previous.find(entry => entry.id === id);
      if (match) {
        return previous.map(entry => (entry.id === id ? { ...entry, new: 0 } : entry));
      }
      return [...previous, { id, new: 0 }];
    });
  };

  const emitActiveConversation = id => {
    clearNew(activeConversation);
    setActiveConversation(id);
    clearNew(id);
    client.current.emit('set-channel', id);
  };

  const createChannel = label => {
    client.current.emit('create-channel', label);
  };

  const setUserName = newUsername => {
    client.current.emit('update-name', newUsername);
  };

  const getName = id => {
    const match = userlist.find(user => user.id === id);
    return match ? match.name : 'Missing';
  };

  const getColor = id => {
    const match = userlist.find(user => user.id === id);
    return match ? match.color : '#89f0a4';
  };

  const getIcon = id => {
    const match = userlist.find(user => user.id === id);
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
    <>
      <div className='filler-div'></div>
      <div className='app'>
        <Header>
          <User userName={getName(userId)} setUserName={setUserName}>
            <UserIcon icon={getIcon(userId)} background={getColor(userId)} status />
          </User>
        </Header>
        <Conversations
          channelList={channelList}
          newMessages={newMessages}
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
            <ChatContent user={getName(messageObj.userId)} messageObj={messageObj} key={messageObj.messageId}>
              <UserIcon
                icon={getIcon(messageObj.userId)}
                size='2.3rem'
                margin='0'
                background={getColor(messageObj.userId)}
              />
            </ChatContent>
          ))}
        </Chat>
        <Users userlist={userlist.filter(user => user.online)} />
      </div>
      <Footer />
    </>
  );
};

export default App;
