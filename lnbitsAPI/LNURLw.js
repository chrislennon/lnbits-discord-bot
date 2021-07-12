const Api = require(`./LnbitsApi.js`);

class LNURLw extends Api {
  constructor(walletAdminKey) {
    super();
    this.headers = { 'X-Api-Key': `${walletAdminKey}` };
    this.urlPath = ``;
  }

  scanLNURL(lnurl) {
    return this.externalApi
      .url(`${this.urlPath}/api/v1/lnurlscan/${lnurl}`)
      .headers(this.headers)
      .get()
      .json();
  }

  createWithdrawlLink(name, amount) {
    return this.externalApi
      .url(`${this.urlPath}/withdraw/api/v1/links`)
      .headers(this.headers)
      .json({
        "title": name, 
        "min_withdrawable": amount,
        "max_withdrawable": amount,
        "uses": 1,
        "wait_time": 1,
        "is_unique": true
      })
      .post()
      .json();
  }

  doCallback(lnurlData) {
    console.log(`attampting to claim LNURL payment`);
    console.log({
      "lnurl_callback": lnurlData.callback,
      "amount": (lnurlData.maxWithdrawable)/1000,
      "memo": lnurlData.defaultDescription,
      "out": false,
      "unit": `sat`
    });
    return this.externalApi
      .url(`${this.urlPath}/api/v1/payments`)
      .headers(this.headers)
      .json({
        "lnurl_callback": lnurlData.callback,
        "amount": (lnurlData.maxWithdrawable)/1000,
        "memo": lnurlData.defaultDescription,
        "out": false,
        "unit": `sat`
      })
      .post()
      .json();
  }
}

module.exports = LNURLw;
