import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getClientName, getClientColor, getClientIcon } from 'reducers/slices/users';
import UserIcon from 'components/UserIcon';

const UserDetails = ({ setUserName }) => {
  const [usernameEdit, setUsernameEdit] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const clientName = useSelector(getClientName);
  const clientColor = useSelector(getClientColor);
  const clientIcon = useSelector(getClientIcon);

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
    setInputValue(clientName);
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
            autoComplete='off'
            required
          />
        </form>
      ) : (
        <button className='header__name-btn' onClick={startEdit}>
          {clientName}
        </button>
      )}
      <UserIcon icon={clientIcon} background={clientColor} status />
    </div>
  );
};

export default UserDetails;
