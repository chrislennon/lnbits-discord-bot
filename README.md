# Discord bot for lnbits

### _This respository is currently a work in progress_

If you wish to discuss any development of this feel free to open an issue or chat on our [telegram group](https://t.me/joinchat/dh4xD_LwlAphOWNk).
Be sure to also check out [lnbits](https://github.com/lnbits/lnbits) for any updates too!

---

The idea for this bot is a proof of concept to enable a [lightning](https://lightning.network/) based ecosystem for a Discord Server. It will leverage [lnbits](https://github.com/lnbits/lnbits) for low friction of Bitcoin via lightning for all users. 

In essence, allowing members of a Discord server to create wallets, deposit, transact (tip) between members, and withdraw from the ecosystem.

- [x] Create a wallet for self and other users
- [x] Create only one user account per Discord user
- [x] Create only one wallet per Discord user
- [x] Retrieve wallet balance of Discord user
- [x] Create an invoice
- [X] Pay an invoice
- [x] Display payment link/reference
- [x] Embed QR of invoice request
- [X] Enable tipping between users
- [ ] Implement Paynow interaton handler
- [ ] Enable betting on events
- [ ] Lots more...

---

### Commands

- `/create`
  - Will create yourself a wallet and send you the link
  - In testing you can target another user `/create @user`

- `/balance` 
  - Will show you the balance of your wallets
  - In testing you can target another user `/balance @user`

- `/payme [amount] [description]`
  - Will create a payable invoice link and show it in chat
  - In testing you can target another user `/payme [amount] [description] @user`
  - <img width="614" alt="Screenshot 2021-07-05 at 04 01 16" src="https://user-images.githubusercontent.com/9197696/124408073-bdb26880-dd45-11eb-8972-cbc9007e5cf6.png">

- `/tip @user [amount] [message]`
  - Will tip a user by sending atuomatically paying an invoice
  - message is optional

---

## Installation

### Requirements
- A functional instance of [lnbits](https://github.com/lnbits/lnbits)
  - You can host your own, or use [lnbits.com](https://lnbits.com)
    - .env entry `LNBITS_HOST`
  - You will need to have a user 
    - .env entry `LNBITS_ADMIN_USER_ID`
  - You will need to have an API key for this user 
    - .env entry `LNBITS_ADMIN_API_KEY`
  - You will need to have the "User Manager" extension enabled
    - //TODO This will likely be replaced with a Discord extension to handle the mapping of Discord userids to lnbits users
- A Discord server that you administer or a willing admin from another server
- A Discord bot user (for more detailed steps see [here](./docs/discord_bot.md)) 
  - _This provides `AUTH_TOKEN`_
- Environment for the bot to run
  - [NodeJs](https://nodejs.org/en/download/current/) > v14

### Starting your bot
- Copy the file `.env.example` to `.env` and fill out the above variables
  - You will need to create one user on your lnbits instance to start
- If you have never run the project run `npm install`
- Start the bot with the `npm start` command
  - The bot should report that is connected in the terminal
  - Your bot should be online in Discord 🎉
