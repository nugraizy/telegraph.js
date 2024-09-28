const { Telegraph } = require('../dist');
require('dotenv').config();

const TOKEN = process.env.TELEGRAPH_ACCESS_TOKEN;

const client = new Telegraph(TOKEN);
(async () => {
  const page = await client.getPage({
    path: 'Example-Article-09-28',
    return_content: true,
  });

  console.log(page);
})();
