const { Telegraph } = require('../dist');
require('dotenv').config();

const TOKEN = process.env.TELEGRAPH_ACCESS_TOKEN;

const client = new Telegraph(TOKEN);
(async () => {
  const pages = await client.getPageList({ limit: 20, offset: 0 });

  console.log(pages);
})();
