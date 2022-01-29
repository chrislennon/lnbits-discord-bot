const Api = require(`./LnbitsApi.js`);

class UserWallet extends Api {
  constructor(walletAdminKey) {
    super();
    this.headers = { 'X-Api-Key': `${walletAdminKey}` };
    this.urlPath = `/api/v1`;
  }

  async getBalanceString() {
    const details = await this.getWalletDetails()
    const sats = details.balance / 1000
    const btc = (sats/100000000).toFixed(8).replace(/\.?0+$/,``);
    return `${sats} Satoshis / ฿${btc}`;
  }

  getWalletDetails() {
    return this.externalApi
      .url(`${this.urlPath}/wallet`)
      .headers(this.headers)
      .get()
      .json();
  }

  createInvoice(amount, description) {
    return this.externalApi
      .url(`${this.urlPath}/payments`)
      .headers(this.headers)
      .json({
        "out": false,
        "amount": amount,
        "memo": description
      })
      .post()
      .json();
  }

  payInvoice(bolt11) {
    return this.externalApi
      .url(`${this.urlPath}/payments`)
      .headers(this.headers)
      .json({
        "out": true,
        "bolt11": bolt11
      })
      .post()
      .json();
  }

  checkInvoice(paymentHash) {
    return this.externalApi
      .url(`${this.urlPath}/payments/${paymentHash}`)
      .headers(this.headers)
      .get();
  }
}

module.exports = UserWallet;
