import React from 'react';

const User = ({ userName }) => {
  return (
    <div className='header__user'>
      <p>{userName}</p>
    </div>
  );
};

export default User;
