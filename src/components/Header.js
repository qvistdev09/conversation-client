import React from 'react';
import 'components/Header.scss';

const Header = ({ children }) => {
  return (
    <header className='header'>
      <p>App title</p>
      {children}
    </header>
  );
};

export default Header;
