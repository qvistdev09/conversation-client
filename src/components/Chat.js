import React, { useState, useEffect } from 'react';
import 'components/Chat.scss';

const Chat = ({ send, children, messages }) => {
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

  return (
    <main className='chat'>
      <div className='chat__messages'>{children}</div>
      <form className='chat__form' onSubmit={onSubmit}>
        <input type='text' className='chat__input' value={message} onChange={e => setMessage(e.target.value)} />
        <button className='chat__button'>Send</button>
      </form>
    </main>
  );
};

export default Chat;
