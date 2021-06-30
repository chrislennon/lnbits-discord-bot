# Discord bot for lnbits

### _This respository is currently non functional and a work in progress_

---

The idea for this bot is a proof of concept to enable a [lightning](https://lightning.network/) based ecosystem for a Discord Server. It will leverage [lnbits](https://github.com/lnbits/lnbits) for low friction of Bitcoin via lightning for all users. 

In essence, allowing members of a Discord server to create wallets, deposit, transact (tip) between members, and withdraw from the ecosystem.

---
## Installation

### Requirements
- A functional instance of [lnbits](https://github.com/lnbits/lnbits)
  - You can host your own, or use lnbits.com
- A Discord server that you administer or a willing admin from another server
- A Discord bot user (for more detailed steps see [here](./docs/discord_bot.md)) 
  - _This provides AUTH_TOKEN_
- Environment for the bot to run
  - [NodeJs](https://nodejs.org/en/download/current/) > v14

### Starting your bot
- Copy the file `.env.example` to `.env` and enter your `AUTH_TOKEN`
- Run the command `npm start`

---
---
## Current Direction
* This will only utilize testnet until an arbitrary comfort point is reached with the related projects, including this one.
* This project will utilise [lnbits](https://github.com/lnbits/lnbits) as a simple (and open source) lightning network account management system
* This project will seek to use Discord [slash commands](https://discord.com/developers/docs/interactions/slash-commands) as a more userfriendly interaction point. For example:
  - `/tip @user 100` will send 100 satoshis from the initiating user to the targetted user
  - `/withdraw` will send a direct message to the user with instructions on how issue an invoice to the bot which it will pay


## Notes
* Discord slash commands seem to be fairly early as such there is limited library support. [Discord.js](https://discord.js.org/#/) has this feature in early development.
  - As lnbits is python based and this bot is javascript based, initially interaction will happen over lnbits API on http.
  - Ideally at a future point this bot will operate fully as part of an lnbits extension, currently these will be two independant process.
* In an attempt to keep this modular and control of each component in the appropriate place:
  - The user management/wallets will all live on lnbits
  - The bot will be linked to lnbits via an lnbits extension