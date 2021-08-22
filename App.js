//const Discord = require(`discord.js`);
const dotenv = require(`dotenv`);
const fetch = require(`node-fetch`);
const express = require(`express`);
const UserManager = require(`./lnbitsAPI/UserManager.js`);

dotenv.config();

const app = express();
app.engine(`html`, require(`ejs`).renderFile);

app.get(`/`, (request, response) => response.send(`Root Route`));
app.get(`/login`, (request, response) => {
  const redirect_uri = request.protocol + `://` + request.get(`host`) + `/callback`;
  response.render(__dirname + `/login.html`, {redirect_uri:redirect_uri});
});

// Using a controller to serve a view
app.use(`/callback`, login);      

async function login(request, response) {
  const { code } = request.query;
  const redirect_uri = request.protocol + `://` + request.get(`host`) + `/callback`;

  if (code) {
    try {
      const oauthResult = await fetch(`https://discord.com/api/oauth2/token`, {
        method: `POST`,
        body: new URLSearchParams({
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code,
          grant_type: `authorization_code`,
          redirect_uri,
          scope: `identify`,
        }),
        headers: {
          'Content-Type': `application/x-www-form-urlencoded`,
        },
      });

      const oauthData = await oauthResult.json();
      
      const userResult = await fetch(`https://discord.com/api/users/@me`, {
        headers: {
          authorization: `${oauthData.token_type} ${oauthData.access_token}`,
        },
      });

      const userDetails = await userResult.json();
      console.log(userDetails);

      const um = new UserManager();

      const userWallet = await um.getUserWallet(userDetails.id);
      const walletUrl = `${process.env.LNBITS_HOST}/wallet?usr=${userWallet.user}`;
      console.log(walletUrl);

      return response.redirect(walletUrl);
    } catch (error) {
      // NOTE: An unauthorized token will not throw an error;
      // it will return a 401 Unauthorized response in the try block above
      console.error(error);
    }
  }

  //return response.sendFile(`index.html`, { root: `.` });
  return response.send(`Root Route`);
}

module.exports = app;