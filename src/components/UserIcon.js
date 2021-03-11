import React from 'react';
import { exportIcon } from 'assets/icon-provider';

import 'components/UserIcon.scss';

const UserIcon = ({ icon = 3, background = '#89f0a4', status = false, size = '3rem' }) => {

  return (
    <div className='usericon' style={{ width: size, height: size, backgroundColor: background }}>
      <img src={exportIcon(icon)} alt='temp' className='usericon__svg' />
      {status && <div className='usericon__status'></div>}
    </div>
  );
};

export default UserIcon;
