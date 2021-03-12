import React, { useState, useEffect } from 'react';
import 'components/Chat.scss';

const Chat = ({ send, children, messages, alertTyping, usersTyping, currentChannel }) => {
  const [message, setMessage] = useState('');

  const onSubmit = e => {
    e.preventDefault();
    send(message);
    setMessage('');
  };

  useEffect(() => {
    const container = document.querySelector('.chat__messages');
    container.scrollTop = container.scrollHeight;
  }, [messages]);

  const handleOnChange = e => {
    alertTyping();
    setMessage(e.target.value);
  };

  return (
    <main className='chat'>
      <h2 className='chat__channeltag'>
        <span>#</span>
        {currentChannel}
      </h2>
      <div className='chat__messages'>{children}</div>
      <div className="chat__form-container">
        <p>{usersTyping}</p>
        <form className='chat__form' onSubmit={onSubmit}>
          <input type='text' className='chat__input' value={message} onChange={handleOnChange} required/>
          <button className='chat__button'>Send</button>
        </form>
      </div>
    </main>
  );
};

export default Chat;
