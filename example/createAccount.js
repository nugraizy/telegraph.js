const { Telegraph } = require('../dist');

const client = new Telegraph();

(async () => {
  const account = await client.createAccount({
    author_name: 'nugraizy',
    author_url: 'https://authorurl.com',
    short_name: 'nugra',
  });

  client.token = account.access_token;
})();
