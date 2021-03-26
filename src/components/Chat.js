import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import 'components/Chat.scss';

const Chat = ({ send, children, alertTyping, usersTyping }) => {
  const currentChannel = useSelector(({ channels }) => {
    const matchedChannel = channels.list.find(channel => channel.id === channels.active);
    return matchedChannel ? matchedChannel.label : '';
  });
  const spamBlock = useSelector(({ users }) => users.clientBlocked);
  const [message, setMessage] = useState('');

  const onSubmit = e => {
    e.preventDefault();
    send(message);
    setMessage('');
  };

  useEffect(() => {
    const container = document.querySelector('.chat__messages');
    container.scrollTop = container.scrollHeight;
  });

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
      <div className='chat__messages'>{children}</div>
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
            disabled={spamBlock}
            placeholder={spamBlock ? 'Please hold back a bit on your messages!' : 'Type here!'}
          />
          <button className='chat__button'>Send</button>
        </form>
      </div>
    </main>
  );
};

export default Chat;
