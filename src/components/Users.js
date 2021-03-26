import React from 'react';
import { useSelector } from 'react-redux';
import 'components/Users.scss';

import UserIcon from 'components/UserIcon';

const Users = () => {
  const userlist = useSelector(({ users }) => users.list.filter(user => user.online));
  return (
    <aside className='users'>
      {userlist.map(user => (
        <div key={user.id} className='users__row'>
          <UserIcon icon={user.icon} background={user.color} status size='2rem' />
          <p className='users__nametag'>{user.name}</p>
        </div>
      ))}
    </aside>
  );
};

export default Users;
