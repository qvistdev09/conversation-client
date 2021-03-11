import React from 'react';
import 'components/Header.scss';

const Header = ({ children }) => {
  return (
    <header className='header'>
      <div className="header__left">
        <i className='far fa-comment-dots header__icon'></i>
        <h1 className='header__title'>conversations</h1>
      </div>
      {children}
    </header>
  );
};

export default Header;
