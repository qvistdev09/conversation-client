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

const cacheControl = (parsedSequence, channelId) => {
  const missingInCache = [];
  parsedSequence.forEach(identifier => {
    const cachedMessage = getFromCache(channelId, identifier);
    if (!cachedMessage) {
      missingInCache.push(identifier);
    }
  });
  return missingInCache;
};

const saveMessagesInCache = (channelId, messageObjArray) => {
  messageObjArray.forEach(obj => saveInCache(channelId, obj));
};

export { getFromCache, saveInCache, clearCache, cacheControl, saveMessagesInCache };
