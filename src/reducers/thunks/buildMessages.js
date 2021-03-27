import { getFromCache, cacheControl, saveMessagesInCache } from 'data-handling/cache';
import { setConstructedMessages } from 'reducers/slices/messages';
import { setConnectedStatus, setStatusText } from 'reducers/slices/appStatus';

const buildMessages = (sequence, channelId, retrieveMessages) => {
  return async (dispatch, getState) => {
    const { active } = getState().channels;
    if (active !== channelId) {
      dispatch(setConnectedStatus(false));
      dispatch(setStatusText('Retrieving messages...'));
    }
    const parsedSequence = sequence
      .split('-')
      .filter(str => str !== '')
      .map(nr => parseInt(nr, 10));
    const missingInCache = cacheControl(parsedSequence, channelId);
    if (missingInCache.length > 0) {
      const newMessages = await retrieveMessages(channelId, missingInCache);
      console.log('Had to retreive messages from the server', newMessages.length);
      saveMessagesInCache(channelId, newMessages);
    }
    const stagedMessages = [];
    parsedSequence.forEach(identifier => stagedMessages.push(getFromCache(channelId, identifier)));
    dispatch(setConstructedMessages(stagedMessages));
    dispatch(setConnectedStatus(true));
  };
};

export default buildMessages;
