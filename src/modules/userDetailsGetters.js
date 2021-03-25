const getName = (id, userlist) => {
  const match = userlist.find(user => user.id === id);
  return match ? match.name : '. . .';
};

const getColor = (id, userlist) => {
  const match = userlist.find(user => user.id === id);
  return match ? match.color : '#89f0a4';
};

const getIcon = (id, userlist) => {
  const match = userlist.find(user => user.id === id);
  if (match && match.icon) {
    return match.icon;
  }
  return '0';
};

export { getName, getColor, getIcon };
