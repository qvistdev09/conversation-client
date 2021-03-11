const nodeEnv = process.env.NODE_ENV;

const serverPaths = {
  production: 'https://tiny-conversation.herokuapp.com',
  development: 'http://localhost:8080',
}

const getServer = () => serverPaths[nodeEnv] ? serverPaths[nodeEnv] : serverPaths.development;

export default getServer;


