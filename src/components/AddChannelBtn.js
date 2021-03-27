import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const AddChannelBtn = ({ createChannel }) => {
  const connected = useSelector(({ appStatus }) => appStatus.connected);
  const [edit, setEdit] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const input = document.querySelector('.conversations__add-channel-input');
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
    <div className='conversations__add-channel'>
      {edit ? (
        <form onSubmit={handleSubmit} className='conversations__add-channel-form'>
          <input
            type='text'
            onBlur={() => {
              setEdit(false);
              setInputValue('');
            }}
            className='conversations__add-channel-input'
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            required
          />
        </form>
      ) : (
        <button className='conversations__add-channel-btn' onClick={() => setEdit(true)} disabled={!connected}>
          + Add Channel
        </button>
      )}
    </div>
  );
};

export default AddChannelBtn;
