# Discord bot for lnbits

If you wish to discuss any development of this feel free to open an issue or chat on our [telegram group](https://t.me/joinchat/dh4xD_LwlAphOWNk).
Be sure to also check out [lnbits](https://github.com/lnbits/lnbits) for any updates too!

---

The idea for this bot is a proof of concept to enable a [lightning](https://lightning.network/) based ecosystem for a Discord Server. It will leverage [lnbits](https://github.com/lnbits/lnbits) for low friction of Bitcoin via lightning for all users. 

Some current features:

- [x] Create a wallet for self and other users
- [x] Create only one user account per Discord user
- [x] Create only one wallet per Discord user
- [x] Retrieve wallet balance of Discord user
- [x] Create an invoice
- [X] Pay an invoice
- [x] Display payment link/reference
- [x] Embed QR of invoice request
- [X] Enable tipping between users
- [ ] Enable role/server invite paywall
- [ ] Implement Paynow interaton handler
- [ ] Enable betting on events
- [ ] Lots more...

---

### Commands

`/create` Will create a wallet for the Discord user 
  - (currently limiting 1 Discord user == 1 LNbits user == 1 user wallet)

![create](https://imgur.com/CWdDusE.png)

`/balance` Will show the balance of the users wallet.

![balance](https://imgur.com/tKeReCp.png)

`/tip @user [amount]` Will send money from one user to another
  - If the recieving user does not have a wallet, one will be created for them
  - The receiving user will receive a direct message from the bot with a link to their wallet

![tip](https://imgur.com/K3tnChK.png)

`/payme [amount] [description]` Will open an invoice that can be paid by any user

![payme](https://imgur.com/dFvAqL3.png)
---

## Installation

### Requirements
- Environment for the bot to run
  - [NodeJs](https://nodejs.org/en/download/current/) > v14
- A functional instance of [LNBits](https://github.com/lnbits/lnbits)
  - You can host your own, or use [lnbits.com](https://lnbits.com)
    - _This provides .env entry `LNBITS_HOST`_
    - If you do not have an LNBits instance you can use https://lnbits.com
  - You will need to have a user on your LNBits instance
    - _This provides .env entry `LNBITS_ADMIN_USER_ID`_
    - For example with `http://lnbits.com/wallet?usr=0123456789abcdef0987654321&wal=ababababababababababababab` your admin user id will be `0123456789abcdef0987654321`
  - You will need to have an API key for this user 
    - _This provides .env entry `LNBITS_ADMIN_API_KEY`_
    - You can find this in the right hand panel, in the example below this will be `abc123abc123abc123abc123abc123abc`
    - ![adminkey](https://i.imgur.com/RNTs4Kk.png)
  - You will need to have the "User Manager" extension enabled
    - 🚨 Once [lnbits#258](https://github.com/lnbits/lnbits/pull/258) and [lnbits-discord-bot#4](https://github.com/chrislennon/lnbits-discord-bot/pull/4) are merged 🚨
      - You will be able to use the 'Discord Bot' extension
- A Discord server that you administer or a willing admin from another server
- A Discord bot user (for more detailed steps see [here](./docs/discord_bot.md)) 
  - _This provides .env entry `AUTH_TOKEN`_

### Starting your bot
- Copy the file `.env.example` to `.env` and fill out the above variables
- If you have never run the project run `npm install`
- Start the bot with the `npm start` command
  - The bot should report that is connected in the terminal
  - Your bot should be online in Discord 🎉
