const { Telegraph } = require('../dist');

const TOKEN = process.env.TELEGRAPH_ACCESS_TOKEN;

const client = new Telegraph(TOKEN);

(async () => {
  const account = await client.revokeAccessToken();

  console.log(account);
})();
