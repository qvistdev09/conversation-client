import React from 'react';
import 'components/Conversations.scss';

const Conversations = ({ channelList }) => {
  return (
    <nav className='conversations'>
      {channelList.map(channel => (
        <button className='conversations__channelBtn' key={channel.id}>
          {channel.label}
        </button>
      ))}
    </nav>
  );
};

export default Conversations;
