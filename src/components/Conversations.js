import React from 'react';
import 'components/Conversations.scss';

const Conversations = ({ channelList, newMessages, emitActiveConversation, activeConversation, children }) => {
  const btnClass = id => {
    const status = id === activeConversation ? 'active' : 'inactive';
    return `conversations__channelBtn conversations__channelBtn--${status}`;
  };

  const newInChannel = id => {
    const matchedEntry = newMessages.find(entry => entry.id === id);
    if (matchedEntry && matchedEntry.new > 0) {
      return matchedEntry.new;
    }
    return '';
  };

  const shouldDisplay = id => id !== activeConversation;

  return (
    <nav className='conversations'>
      {channelList.map(channel => (
        <button className={btnClass(channel.id)} key={channel.id} onClick={() => emitActiveConversation(channel.id)}>
          <span>#</span>
          {channel.label}
          {shouldDisplay(channel.id) && newInChannel(channel.id) !== '' && (
            <span className='conversations__new'>{newInChannel(channel.id)}</span>
          )}
        </button>
      ))}
      {children}
    </nav>
  );
};

export default Conversations;
