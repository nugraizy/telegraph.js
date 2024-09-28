const { Telegraph } = require('../dist');

const TOKEN = process.env.TELEGRAPH_ACCESS_TOKEN;

const client = new Telegraph(TOKEN);

(async () => {
  const accountInfo = await client.getAccountInfo({
    fields: [
      'author_name',
      'author_url',
      'page_count',
      'short_name',
      'auth_url',
    ],
  });

  console.log(accountInfo);
})();
