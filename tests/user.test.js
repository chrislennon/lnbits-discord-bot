const dotenv = require(`dotenv`);
dotenv.config();
const nock = require(`nock`);

const UserManager = require(`../lnbitsAPI/UserManager.js`);

const lnbitsApi = nock(process.env.LNBITS_HOST)
  .persist()
  .defaultReplyHeaders({
    'Content-Type': `application/json`,
  });

const userTable = [
  {
    "admin": `adminid-000`,
    "discord_id": `discordid-000`,
    "id": `userid-000`,
    "name": `username-000`
  },
  {
    "admin": `adminid-000`,
    "discord_id": `discordid-001`,
    "id": `userid-001`,
    "name": `username-001`
  },
  {
    "admin": `adminid-000`,
    "discord_id": `discordid-002`,
    "id": `userid-002`,
    "name": `username-002`
  }
];

lnbitsApi
  .get(`/discordbot/api/v1/users`)
  .reply(200, userTable);

const walletTable = [
  {
    "admin": `adminid-000`,
    "adminkey": `adminkey-000`,
    "id": `walletid-000`,
    "inkey": `invoicekey-000`,
    "name": `username-000`,
    "user": `userid-000`
  }
];


it(`should return all users`, async () => {
  const um = new UserManager();
  const users = await um.getUsers().json();
  
  return expect(users).toEqual(userTable);
});

it(`should return a wallet object from a discord id`, async () => {

  const user = userTable[0];
  const userWallet = walletTable[0];

  lnbitsApi
  .get(`/discordbot/api/v1/wallets/${user.id}`)
  .reply(200, walletTable);

  const um = new UserManager();
  const wallet = await um.getUserWallet(user.discord_id);
  
  return expect(wallet).toEqual(userWallet);
});
