import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setList, setClientId, setSpamBlock } from 'reducers/slices/users';
import {
  setChannelsList,
  setActiveChannel,
  setUsersTyping,
  addTypingUser,
  removeUserTyping,
} from 'reducers/slices/channels';
import { io } from 'socket.io-client';
import getServer from 'config/server-url';

import 'components/App.scss';

// components

import Header from 'components/Header';
import UserDetails from 'components/UserDetails';
import UserIcon from 'components/UserIcon';
import Conversations from 'components/Conversations';
import AddChannelBtn from 'components/AddChannelBtn';
import Chat from 'components/Chat';
import ChatContent from 'components/ChatContent';
import Users from 'components/Users';
import Footer from 'components/Footer';

import { getFromCache, saveInCache, clearCache } from 'data-handling/cache';

const App = () => {
  const dispatch = useDispatch();
  const usersList = useSelector(({ users }) => users.list);
  const activeConversation = useSelector(({ channels }) => channels.active);
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState([]);
  const [loadingText, setLoadingText] = useState('Waking up server, please wait...');
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

  const retrieveMessages = (channelId, messageIdArray) =>
    new Promise(resolve => {
      client.current.emit('need-messages', channelId, messageIdArray, responseArray => {
        resolve(responseArray);
      });
    });

  const saveMessagesInCache = (channelId, messageObjArray) => {
    messageObjArray.forEach(obj => saveInCache(channelId, obj));
  };

  const cacheControl = (parsedSequence, channelId) => {
    const missingInCache = [];
    parsedSequence.forEach(identifier => {
      const cachedMessage = getFromCache(channelId, identifier);
      if (!cachedMessage) {
        missingInCache.push(identifier);
      }
    });
    return missingInCache;
  };

  const rebuildMessages = async (
    sequence,
    channelId,
    cacheControl,
    retrieveMessages,
    saveMessagesInCache,
    activeConversation
  ) => {
    if (channelId !== activeConversation) {
      setLoadingText('Loading...');
    }
    const parsedSequence = sequence
      .split('-')
      .filter(str => str !== '')
      .map(nr => parseInt(nr, 10));
    const missingInCache = cacheControl(parsedSequence, channelId);
    if (missingInCache.length > 0) {
      const newMessages = await retrieveMessages(channelId, missingInCache);
      saveMessagesInCache(channelId, newMessages);
    }
    const stagedMessages = [];
    parsedSequence.forEach(identifier => stagedMessages.push(getFromCache(channelId, identifier)));
    setMessages(stagedMessages);
    setLoadingText('');
  };

  useEffect(() => {
    client.current = io(getServer());
    const socket = client.current;
    socket.on('clear-cache', () => clearCache());
    socket.on('user-list', usersArray => dispatch(setList(usersArray)));
    socket.on('channel-list', channelsArray => dispatch(setChannelsList(channelsArray)));
    socket.on('user-id', receivedId => dispatch(setClientId(receivedId)));
    socket.on('replace-people-typing-aray', usersTypingArray => dispatch(setUsersTyping(usersTypingArray)));
    socket.on('user-started-typing', userId => dispatch(addTypingUser(userId)));
    socket.on('user-stopped-typing', userId => dispatch(removeUserTyping(userId)));
    socket.on('new-channel-message', handleNewMessage);
    socket.on('spam-block', status => dispatch(setSpamBlock(status)));

    return () => {
      socket.close();
    };
  }, [dispatch]);

  useEffect(() => {
    client.current.on('new-sequence', (sequence, channelId) =>
      rebuildMessages(sequence, channelId, cacheControl, retrieveMessages, saveMessagesInCache, activeConversation)
    );
  }, [activeConversation]);

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
    dispatch(setActiveChannel(id));
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
    const match = usersList.find(user => user.id === id);
    return match ? match.name : '. . .';
  };

  const getColor = id => {
    const match = usersList.find(user => user.id === id);
    return match ? match.color : '#89f0a4';
  };

  const getIcon = id => {
    const match = usersList.find(user => user.id === id);
    if (match && match.icon) {
      return match.icon;
    }
    return '0';
  };

  const alertTyping = () => {
    client.current.emit('is-typing');
  };

  return (
    <>
      <div className='filler-div'></div>
      <div className='app'>
        <Header>
          <UserDetails setUserName={setUserName} />
        </Header>
        <Conversations newMessages={newMessages} emitActiveConversation={emitActiveConversation}>
          <AddChannelBtn createChannel={createChannel} />
        </Conversations>
        <Chat
          send={send}
          messages={messages}
          alertTyping={alertTyping}
          loadingText={loadingText}
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
        <Users userlist={usersList.filter(user => user.online)} />
      </div>
      <Footer />
    </>
  );
};

export default App;
