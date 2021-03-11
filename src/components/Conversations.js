import React from 'react';
import 'components/Conversations.scss';

const Conversations = ({ channelList, emitActiveConversation, activeConversation, children }) => {
  const btnClass = id => {
    const status = id === activeConversation ? 'active' : 'inactive';
    return `conversations__channelBtn conversations__channelBtn--${status}`;
  };

  return (
    <nav className='conversations'>
      {channelList.map(channel => (
        <button className={btnClass(channel.id)} key={channel.id} onClick={() => emitActiveConversation(channel.id)}>
          <span>#</span>
          {channel.label}
        </button>
      ))}
      {children}
    </nav>
  );
};

export default Conversations;
