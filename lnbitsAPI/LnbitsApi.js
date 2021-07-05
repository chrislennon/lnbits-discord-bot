const wretch = require(`wretch`);

wretch().polyfills({
  fetch: require(`node-fetch`),
});

class LnbitsApi {
  constructor() {
    this.ApiKey = ``;
    this.description = ``;
    this.options = [];
    this.externalApi = wretch()
    // Set the base url
      .url(`${process.env.LNBITS_HOST}`)
    // Handle 403 errors
      .resolve(_ => _.forbidden(console.log));
  }

  execute() {
    return;
  }
}

module.exports = LnbitsApi;
