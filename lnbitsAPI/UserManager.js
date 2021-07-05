const Api = require(`./LnbitsApi.js`);

class UserManager extends Api {
  constructor() {
    super();
    this.urlPath = `/usermanager/api/v1`;
    this.headers = { 'X-Api-Key': `${process.env.LNBITS_ADMIN_API_KEY}` };
  }

  async createUserWalletIfNotExist(username, discordId) {
    const userObj = await this.getLnbitsUser(discordId);
    if (userObj.length > 0) return userObj[0];
    else {
      const walletId = this.createUserWallet(username, discordId).json();
      return walletId;
    }
  }

  async getLnbitsUser(discordId) {
    const userObj = await this.getUsers().json(json => {
      const result = json.filter(obj => {
        return obj.email === discordId;
      });
      return result[0];
    });
    return userObj;
  }

  async getUserWallet(discordId) {
    const userObj = await this.getLnbitsUser(discordId);
    const userWallet = await this.getWallets(userObj.id);
    return userWallet[0];
  }

  getUsers() {
    return this.externalApi
      .url(`${this.urlPath}/users`)
      .headers(this.headers)
      .get();
  }

  getUser(userId) {
    this.externalApi
      .url(`${this.urlPath}/users/${userId}`)
      .headers(this.headers)
      .get();
  }

  getWallets(userId) {
    return this.externalApi
      .url(`${this.urlPath}/wallets/${userId}`)
      .headers(this.headers)
      .get().json();
  }

  getTransactions(walletId) {
    this.externalApi
      .url(`${this.urlPath}/wallets/${walletId}`)
      .headers(this.headers)
      .get();
  }

  createUserWallet(username, userId) {
    return this.externalApi
      .url(`${this.urlPath}/users`)
      .headers(this.headers)
      .json({
        "admin_id": `${process.env.LNBITS_ADMIN_USER_ID}`,
        "user_name": `${username}`,
        "wallet_name": `${username}-main`,
        "email": `${userId}`
      })
      .post();
  }

  createWallet(username, userId) {
    this.externalApi
      .url(`${this.urlPath}/users`)
      .headers(this.headers)
      .json({
        "admin_id": `${process.env.LNBITS_ADMIN_USER_ID}`,
        "user_id": `${userId}`,
        "wallet_name": `${username}-main`
      })
      .post();
  }

  deleteUserWallet(userId) {
    this.externalApi
      .url(`${this.urlPath}/users/${userId}`)
      .headers(this.headers)
      .delete();
  }

  deleteWallet(walletId) {
    this.externalApi
      .url(`${this.urlPath}/wallets/${walletId}`)
      .headers(this.headers)
      .delete();
  }
}

module.exports = UserManager;
