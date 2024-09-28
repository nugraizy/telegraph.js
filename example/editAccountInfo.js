const { Telegraph } = require('../dist');

const TOKEN = process.env.TELEGRAPH_ACCESS_TOKEN;

const client = new Telegraph(TOKEN);

(async () => {
  const account = await client.editAccountInfo({
    short_name: 'nugra',
    author_name: 'nugraizy',
    author_url: 'https://another-authorurl.com',
  });

  console.log(account);
})();
