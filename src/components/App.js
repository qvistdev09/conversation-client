import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setList, setClientId, setSpamBlock } from 'reducers/slices/users';
import {
  setChannelsList,
  setActiveChannel,
  setUsersTyping,
  addTypingUser,
  removeUserTyping,
} from 'reducers/slices/channels';
import buildMessages from 'reducers/thunks/buildMessages';
import { addOneNewInChannel, clearAllNew } from 'reducers/slices/messages';
import { setConnectedStatus, setStatusText } from 'reducers/slices/appStatus';
import { io } from 'socket.io-client';
import getServer from 'config/server-url';

import 'components/App.scss';

// components

import Header from 'components/Header';
import UserDetails from 'components/UserDetails';
import Conversations from 'components/Conversations';
import AddChannelBtn from 'components/AddChannelBtn';
import Chat from 'components/Chat';
import Users from 'components/Users';
import Footer from 'components/Footer';

import { clearCache } from 'data-handling/cache';

const App = () => {
  const dispatch = useDispatch();
  const activeConversation = useSelector(({ channels }) => channels.active);
  const client = useRef();

  const retrieveMessages = (channelId, messageIdArray) =>
    new Promise(resolve => {
      client.current.emit('need-messages', channelId, messageIdArray, responseArray => {
        resolve(responseArray);
      });
    });

  useEffect(() => {
    client.current = io(getServer());
    const socket = client.current;
    socket.on('is-connected', () => dispatch(setConnectedStatus(true)));
    socket.on('clear-cache', () => clearCache());
    socket.on('user-list', usersArray => dispatch(setList(usersArray)));
    socket.on('channel-list', channelsArray => dispatch(setChannelsList(channelsArray)));
    socket.on('user-id', receivedId => dispatch(setClientId(receivedId)));
    socket.on('replace-people-typing-aray', usersTypingArray => dispatch(setUsersTyping(usersTypingArray)));
    socket.on('user-started-typing', userId => dispatch(addTypingUser(userId)));
    socket.on('user-stopped-typing', userId => dispatch(removeUserTyping(userId)));
    socket.on('new-channel-message', channelId => dispatch(addOneNewInChannel(channelId)));
    socket.on('spam-block', status => dispatch(setSpamBlock(status)));
    socket.on('new-sequence', (sequence, channelId) => dispatch(buildMessages(sequence, channelId, retrieveMessages)));
    socket.on('disconnect', () => {
      dispatch(setConnectedStatus(false));
      dispatch(setStatusText('Lost connection with server, reconnecting...'));
    });

    return () => {
      socket.close();
    };
  }, [dispatch]);

  const send = message => {
    client.current.emit('channel-message', message);
  };

  const emitActiveConversation = id => {
    dispatch(clearAllNew(activeConversation));
    dispatch(setActiveChannel(id));
    dispatch(clearAllNew(id));
    client.current.emit('set-channel', id);
  };

  const createChannel = label => {
    client.current.emit('create-channel', label);
  };

  const setUserName = newUsername => {
    client.current.emit('update-name', newUsername);
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
        <Conversations emitActiveConversation={emitActiveConversation}>
          <AddChannelBtn createChannel={createChannel} />
        </Conversations>
        <Chat send={send} alertTyping={alertTyping} />
        <Users />
      </div>
      <Footer />
    </>
  );
};

export default App;
