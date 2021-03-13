let cachedMessages = {};

const getFromCache = (channelId, messageId) => {
  if (cachedMessages[channelId] && cachedMessages[channelId][messageId]) {
    return cachedMessages[channelId][messageId];
  }
  return null;
};

const saveInCache = (channelId, messageObj) => {
  if (cachedMessages[channelId]) {
    cachedMessages[channelId][messageObj.messageId] = messageObj;
  } else {
    cachedMessages[channelId] = { [messageObj.messageId]: messageObj };
  }
};

const clearCache = () => {
  cachedMessages = {};
};

export { getFromCache, saveInCache, clearCache };
