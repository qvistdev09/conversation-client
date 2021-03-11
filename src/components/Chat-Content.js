import React from 'react';

const ChatContent = ({ user, messageObj }) => {
  const formatTimeStamp = timeString => {
    const dateObj = new Date(timeString);
    return dateObj.getHours() + ':' + (dateObj.getMinutes() < 10 ? `0${dateObj.getMinutes()}` : dateObj.getMinutes());
  };

  return (
    <div className='chat__content'>
      <div className='chat__content-header'>
        <p>{user}</p>
        <p>{formatTimeStamp(messageObj.time)}</p>
      </div>
      <p className='chat__content-text'>{messageObj.text}</p>
    </div>
  );
};

export default ChatContent;
