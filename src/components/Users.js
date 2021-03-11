import React from 'react';
import 'components/Users.scss';

import UserIcon from 'components/UserIcon';

const Users = ({ userlist = [] }) => {
  return (
    <aside className='users'>
      {userlist.map(user => (
        <div key={user.pubId} className='users__row'>
          <UserIcon icon={user.icon} background={user.color} status size='2rem' />
          <p>{user.name}</p>
        </div>
      ))}
    </aside>
  );
};

export default Users;
