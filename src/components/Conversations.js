import React from 'react';
import 'components/Conversations.scss';

const Conversations = ({ channelList, setActiveChannel }) => {
  return (
    <nav className='conversations'>
      {channelList.map(channel => (
        <button className='conversations__channelBtn' key={channel.id} onClick={() => setActiveChannel(channel.id)}>
          {channel.label}
        </button>
      ))}
    </nav>
  );
};

export default Conversations;
