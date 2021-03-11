import React, { useState, useEffect } from 'react';

const AddChannelBtn = ({ createChannel }) => {
  const [edit, setEdit] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const input = document.querySelector('.conversations__new-channel-input');
    if (input) {
      input.focus();
    }
  });

  const handleSubmit = e => {
    e.preventDefault();
    createChannel(inputValue);
    setInputValue('');
    setEdit(false);
  };

  return (
    <div className='conversations__add-channel-btn'>
      {edit ? (
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            onBlur={() => setEdit(false)}
            className='conversations__new-channel-input'
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
          />
        </form>
      ) : (
        <button onClick={() => setEdit(true)}>Add Channel</button>
      )}
    </div>
  );
};

export default AddChannelBtn;
