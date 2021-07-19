const dotenv = require(`dotenv`);
dotenv.config();
const nock = require(`nock`);

const UserManager = require(`../../lnbitsAPI/UserManager.js`);

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




describe(`User manager tests`, () => {

  beforeAll(() => {
    process.env.LNBITS_HOST = 'https://test-lnbits-mock-endpoint';
    lnbitsApi = nock(process.env.LNBITS_HOST)
    .defaultReplyHeaders({
      'Content-Type': `application/json`,
    });
  });

  afterAll(() => {
    process.env.LNBITS_ADMIN_USER_ID = undefined;
    process.env.LNBITS_HOST = undefined;
  });

  it(`should return all users`, async () => {
    lnbitsApi
    .get(`/discordbot/api/v1/users`)
    .reply(200, userTable);

    const um = new UserManager();
    const users = await um.getUsers().json();

    return expect(users).toEqual(userTable);
  });

  it(`should return a wallet object from a discord id`, async () => {
    const user = userTable[0];
    const userWallet = walletTable[0];

    lnbitsApi
    .get(`/discordbot/api/v1/users`)
    .reply(200, userTable);

    lnbitsApi
    .get(`/discordbot/api/v1/wallets/${user.id}`)
    .reply(200, walletTable);

    const um = new UserManager();
    const wallet = await um.getUserWallet(user.discord_id);

    return expect(wallet).toEqual(userWallet);
  });

  it(`should return a lnbits user object based on a discord id`, async () => {
    const testUser = userTable[1];

    lnbitsApi
    .get(`/discordbot/api/v1/users`)
    .reply(200, userTable);

    const um = new UserManager();
    const userData = await um.getLnbitsUser(testUser.discord_id);

    return expect(userData).toEqual(testUser);
  });

  it(`should create a wallet for a user that does not has one yet`, async () => {
    const userWallet = walletTable[0];
    const testAdminId = 'test-admin-id';
    process.env.LNBITS_ADMIN_USER_ID = testAdminId;

    const testUser =  {
      "admin": testAdminId,
      "discord_id": `discordid-099`,
      "id": `userid-099`,
      "name": `username-099`
    };

    lnbitsApi
    .get(`/discordbot/api/v1/users`)
    .reply(200, userTable);

    lnbitsApi
    .post(`/discordbot/api/v1/users`, {
      'admin_id': testAdminId,
      'user_name': testUser.name,
      'wallet_name': `${testUser.name}-main`,
      'discord_id': testUser.discord_id
    })
    .reply(201, {});

    lnbitsApi
    .get(`/discordbot/api/v1/users`)
    .reply(200, userTable.concat([testUser]));

    lnbitsApi
    .get(`/discordbot/api/v1/wallets/${testUser.id}`)
    .reply(200, walletTable);

    const um = new UserManager();
    const userData = await um.getOrCreateWallet(testUser.name, testUser.discord_id);

    return expect(userData).toEqual(userWallet);
  });

  it(`should not create a wallet for a user that already has one`, async () => {
    const userWallet = walletTable[0];
    const testUser =  userTable[1];

    lnbitsApi
    .get(`/discordbot/api/v1/users`)
    .reply(200, userTable);

    lnbitsApi
    .get(`/discordbot/api/v1/wallets/${testUser.id}`)
    .reply(200, walletTable);

    const um = new UserManager();
    const userData = await um.getOrCreateWallet(testUser.name, testUser.discord_id);

    return expect(userData).toEqual(userWallet);
  });
});
