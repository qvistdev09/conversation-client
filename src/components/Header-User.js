import React, { useState, useEffect } from 'react';

const User = ({ userName, setUserName, children }) => {
  const [usernameEdit, setUsernameEdit] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const input = document.querySelector('.header__username-input');
    if (input) {
      input.focus();
    }
  });

  const handleSubmit = e => {
    e.preventDefault();
    setUserName(inputValue);
    setInputValue('');
    setUsernameEdit(false);
  };

  const startEdit = () => {
    setInputValue(userName);
    setUsernameEdit(true);
  };

  return (
    <div className='header__user'>
      {usernameEdit ? (
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onBlur={() => setUsernameEdit(false)}
            className='header__username-input'
          />
        </form>
      ) : (
        <button onClick={startEdit}>{userName}</button>
      )}
      {children}
    </div>
  );
};

export default User;
