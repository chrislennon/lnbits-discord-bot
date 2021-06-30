# Quick guide for creation of Discord bot

## The Basics

* With a logged in Discord account, go to the [developer portal](https://discord.com/developers/applications)
  - Select 'New Application' and enter a name
* On the left hand side select 'bot' and select 'add bot'
  - You will be prompted to accept converting this to a bot user, this is fine
* On the bot page, select 'Click to Reveal Token'
  - Take note of this token, it will be your .env file `AUTH_TOKEN`

## Permissions and adding to a server

* Move over to the OAuth2 on the left hand side
* Select the following scopes
  - bot
  - application.commands
* Select the following permissions
  - Administrator (//TODO not be so sloppy 🤪)
* You will be given a URL to copy in the scope section of the page
  - Copy this URL and paste it into your browser
  - You will be prompted which server you wish to add this bot
  - _Note:_ you can only add bots to servers you own
* Your bot should then be added to your server 🎉
