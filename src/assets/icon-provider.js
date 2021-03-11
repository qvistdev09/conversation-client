const files = require.context('assets', false, /\.svg$/);

const icons = {};

const tidyFilename = string => string.replace('./', '').replace('.svg', '').replace('icon', '');

files.keys().forEach(key => {
  icons[tidyFilename(key)] = files(key);
});

export { icons };
