import React, { useState, useEffect } from 'react';

const AddChannelBtn = ({ createChannel }) => {
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
          />
        </form>
      ) : (
        <button className='conversations__add-channel-btn' onClick={() => setEdit(true)}>
          + Add Channel
        </button>
      )}
    </div>
  );
};

export default AddChannelBtn;
