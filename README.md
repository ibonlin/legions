# A Node.js Discord Game Stats Bot!
-------------

### Setup:
[![Known Vulnerabilities](https://snyk.io/test/github/nrpatten/node-gamebot/badge.svg)](https://snyk.io/test/github/nrpatten/node-gamebot)

* Goto https://discordapp.com/developers/docs/intro click Applications > My Apps on the left hand side.
 * Click New App and set up your bot, Under 'APP BOT USER' copy the token this is the token for clientToken.
 * Under BOT DETAILS copy ClientID
 * Add your ClientID to this link where it says YourClientID https://discordapp.com/oauth2/authorize?&client_id=YourClientID&scope=bot&permissions=0
 * Edit index.js
 * Add your `clientToken` to line 5
 * Add your server ip to `YorServerIP` on line 8
 * Add your server port to `YorServerPort` on line 9
 * Goto https://pubgtracker.com/site-api signup and get a PUBG api key.
 * Add your PUBG api key to `apikey` on line 12

`npm install`

`npm start` or `node index.js`

Done..

### Bot Commands

* !info for server info
* !Players for a list of online players
* !stats for info/players