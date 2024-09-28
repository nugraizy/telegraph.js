const { Telegraph } = require('../dist');
require('dotenv').config();

const TOKEN = process.env.TELEGRAPH_ACCESS_TOKEN;

const telegraph = new Telegraph(TOKEN);

(async () => {
  try {
    const page = await telegraph.createPage({ title: '', content: [] });
  } catch (error) {
    console.error(error.message);
  }
})();
