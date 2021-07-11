const Api = require(`./LnbitsApi.js`);

class Extensions extends Api {
  constructor(lnbitsUserId) {
    super();
    this.lnbitsUserId = lnbitsUserId;
    this.headers = {};
    this.urlPath = `/extensions`;
  }

  enable(extensionName) {
    return this.externalApi
      .url(`${this.urlPath}`)
      .query({ 
        usr: this.lnbitsUserId,
        enable: extensionName
      })
      .headers(this.headers)
      .get();
  }

  disable(extensionName) {
    return this.externalApi
      .url(`${this.urlPath}`)
      .query({ 
        usr: this.lnbitsUserId,
        disable: extensionName
      })
      .headers(this.headers)
      .get();
  }
}

module.exports = Extensions;
