import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getName, getIcon, getColor } from 'modules/userDetailsGetters';

import ChatContent from 'components/ChatContent';
import UserIcon from 'components/UserIcon';
import 'components/Chat.scss';

const Chat = ({ send, alertTyping }) => {
  const appStatus = useSelector(({ appStatus }) => appStatus);
  const messages = useSelector(({ messages }) => messages.constructed);
  const currentChannel = useSelector(({ channels }) => {
    const matchedChannel = channels.list.find(channel => channel.id === channels.active);
    return matchedChannel ? matchedChannel.label : '';
  });
  const spamBlock = useSelector(({ users }) => users.clientBlocked);
  const [message, setMessage] = useState('');
  const usersList = useSelector(({ users }) => users.list);
  const usersTyping = useSelector(state => {
    const { clientId } = state.users;
    const { usersTyping } = state.channels;
    const usersList = state.users.list;
    const filtered = usersTyping.filter(id => id !== clientId);
    if (filtered.length === 1) {
      return `${getName(filtered[0], usersList)} is typing`;
    }
    if (filtered.length < 3) {
      let alert = '';
      filtered.forEach((user, index) => {
        if (index !== filtered.length - 1) {
          alert += `${getName(user, usersList)}, `;
        } else {
          alert += `and ${getName(user, usersList)} are typing`;
        }
      });
      return alert;
    }
    return 'Several people are typing';
  });

  useEffect(() => {
    const container = document.querySelector('.chat__messages');
    container.scrollTop = container.scrollHeight;
  });

  const onSubmit = e => {
    e.preventDefault();
    send(message);
    setMessage('');
  };

  const handleOnChange = e => {
    alertTyping();
    setMessage(e.target.value);
  };

  return (
    <main className='chat'>
      <h2 className='chat__channeltag'>
        <span style={{ opacity: currentChannel !== '' ? '1' : '0' }}>#</span>
        {currentChannel}
      </h2>
      <div className='chat__messages'>
        {appStatus.connected ? (
          messages.map(messageObj => (
            <ChatContent
              user={getName(messageObj.userId, usersList)}
              messageObj={messageObj}
              key={messageObj.messageId}
            >
              <UserIcon
                icon={getIcon(messageObj.userId, usersList)}
                size='2.3rem'
                margin='0'
                background={getColor(messageObj.userId, usersList)}
              />
            </ChatContent>
          ))
        ) : (
          <div className='chat__loadingdiv'>
            <i className='fas fa-sync-alt chat__loadingicon'></i>
            <p className='chat__loadingtext'>{appStatus.statusText}</p>
          </div>
        )}
      </div>
      <div className='chat__form-container'>
        {usersTyping !== '' && (
          <p className='chat__typingalert'>
            {usersTyping}
            <span className='chat__dot1'>.</span>
            <span className='chat__dot2'>.</span>
            <span className='chat__dot3'>.</span>
          </p>
        )}
        <form className='chat__form' onSubmit={onSubmit}>
          <input
            type='text'
            className='chat__input'
            value={message}
            onChange={handleOnChange}
            required
            disabled={spamBlock || !appStatus.connected}
            placeholder={spamBlock ? 'Please hold back a bit on your messages!' : 'Type here!'}
            style={{ opacity: appStatus.connected ? 1 : 0.35 }}
          />
          <button className='chat__button' disabled={!appStatus.connected}>
            Send
          </button>
        </form>
      </div>
    </main>
  );
};

export default Chat;
