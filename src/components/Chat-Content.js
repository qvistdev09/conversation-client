import React from 'react';

const ChatContent = ({ user, messageObj, children }) => {
  const formatTimeStamp = timeString => {
    const dateObj = new Date(timeString);
    return dateObj.getHours() + ':' + (dateObj.getMinutes() < 10 ? `0${dateObj.getMinutes()}` : dateObj.getMinutes());
  };

  return (
    <div className='chat__content'>
      <div className='chat__left'>
        { children }
      </div>
      <div className='chat__right'>
        <div className="chat__pointer"></div>
        <div className='chat__content-header'>
          <p className='chat__nametag'>{user}</p>
          <p className='chat__timetag'>{formatTimeStamp(messageObj.time)}</p>
        </div>
        <p className='chat__texttag'>{messageObj.text}</p>
      </div>
    </div>
  );
};

export default ChatContent;
