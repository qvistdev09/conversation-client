import React from 'react';
import 'components/Users.scss';

const Users = ({ userlist = [] }) => {
  return (
    <aside className='users'>
      {userlist.map(user => (
        <p key={user.pubId}>{user.name}</p>
      ))}
    </aside>
  );
};

export default Users;
