const Api = require(`./LnbitsApi.js`);

class UserManager extends Api {
  constructor() {
    super();
    this.urlPath = `/usermanager/api/v1`
    this.headers = { 'X-Api-Key': `${process.env.LNBITS_ADMIN_API_KEY}` }
  }

  async createUserWalletIfNotExist(username, userId) {
    const json = await this.getUsers().json(json => {
      console.log('response', json);
      const result = json.filter(obj => {
        return obj.email === userId
      })
      if (result.length > 0) {
        // return existing user object
        return result[0]
      }
      else {
        // return new user object
        return this.createUserWallet(username, userId).json();
      }
    })
    return json
  }

  getUsers() {
    return this.externalApi
    .url(`${this.urlPath}/users`)
    .headers(this.headers)
    .get()
  }

  getUser(userId) {
    this.externalApi
    .url(`${this.urlPath}/users/${userId}`)
    .headers(this.headers)
    .get()
  }

  getWallets(userId) {
    this.externalApi
    .url(`${this.urlPath}/wallets/${userId}`)
    .headers(this.headers)
    .get()
  }

  getTransactions(walletId) {
    this.externalApi
    .url(`${this.urlPath}/wallets/${walletId}`)
    .headers(this.headers)
    .get()
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
    .post()
  }

  createWallet(userId, walletName) {
    this.externalApi
    .url(`${this.urlPath}/users`)
    .headers(this.headers)
    .json({
      "admin_id": `${process.env.LNBITS_ADMIN_USER_ID}`,
      "user_id": `${userId}`,
      "wallet_name": `${username}-main`
    })
    .post()
  }

  deleteUserWallet(userId) {
    this.externalApi
    .url(`${this.urlPath}/users/${userId}`)
    .headers(this.headers)
    .delete()
  }

  deleteWallet(walletId) {
    this.externalApi
    .url(`${this.urlPath}/wallets/${walletId}`)
    .headers(this.headers)
    .delete()
  }
}

module.exports = UserManager;
