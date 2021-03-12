import React from 'react';
import 'components/Footer.scss';

const Footer = () => (
  <footer className='footer'>
    <p className='footer__text'>by Oscar Lindqvist</p>
    <i className='fas fa-circle footer__icon'></i>
    <p className='footer__text'>
      Icons made by{' '}
      <a className='footer__link' href='https://www.freepik.com' title='Freepik'>
        Freepik
      </a>{' '}
      from{' '}
      <a className='footer__link' href='https://www.flaticon.com/' title='Flaticon'>
        www.flaticon.com
      </a>
    </p>
  </footer>
);

export default Footer;
