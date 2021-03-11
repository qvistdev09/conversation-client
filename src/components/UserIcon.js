import React from 'react';
import { exportIcon } from 'assets/icon-provider';

import 'components/UserIcon.scss';

const UserIcon = ({ icon = 3, background = '#89f0a4', status = false, size = '3rem', margin = '0.5rem' }) => {
  return (
    <div
      className='usericon'
      style={{ width: size, minWidth: size, height: size, minHeight: size, backgroundColor: background, margin }}
    >
      <img src={exportIcon(icon)} alt='temp' className='usericon__svg' />
      {status && <div className='usericon__status'></div>}
    </div>
  );
};

export default UserIcon;
