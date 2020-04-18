const {PubgAPI, PubgAPIErrors, REGION, SEASON, MATCH} = require('pubg-api-redis');
const Discord = require('discord.js');
const client = new Discord.Client();
const Gamedig = require('gamedig');
const clientToken = 'NzAwMjg4NTIxMTU5NzA0NjQ2.XpnprA.ExCC-5Q9edQX36xqSfAKLqMZiho';
const prefix = '?';
const game = 'insurgency',
      host = '185.171.25.73',
      port = '27018';

const api = new PubgAPI({
  apikey: '***PUBG-API-KEY***',
});

client.on('ready', () => {
  console.log(`GameBot has started, with ${client.users.size} users, and ${client.channels.size} channels.`)
});

function timeFormat(time) {   
  var hrs = ~~(time / 3600);
  var mins = ~~((time % 3600) / 60);
  var secs = Math.round(time % 60);
  var ret = "";
  if (hrs > 1) {
    ret += "" + hrs + " Hrs " + (mins < 10 ? "0" : "");
  } else
  if (hrs > 0) {
    ret += "" + hrs + " Hr " + (mins < 10 ? "0" : "");
  }
  ret += "" + mins + " Mins " + (secs < 10 ? "0" : "");
  ret += "" + secs + " Secs";
  return ret;
};

client.on('message', message => {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === 'yardım') {
    message.channel.send('```' + 'Commands are: \!serverbilgi Serverin bilgisini gösterir. \!oyuncular Tüm online oyuncuları gösterir\!istatistik Oyuncuların skorlarını gösterir ' + '```');
  }
  /* Arma 3 Stats */
  if (command === 'istatistik') {
    Gamedig.query({
      type: game,
      host: host,
      port: port
    },
    function(err, data) {
      if (err) {
        message.channel.send('```' + 'Server is offline or restarting' + '```');
      } else {
        message.channel.send('```' + 'Server Name: ' + data.name + '\n' + 'Map: ' + data.map + '\n' + 'players online: ' + data.raw.numplayers + '/' + data.maxplayers + '\n' + 'Server Ip/Port: ' + data.query.host + ':' + data.query.port + '```');
      }
    });
  }

  if (command === 'oyuncular') {
    Gamedig.query({
      type: game,
      host: host,
      port: port
    },
    function(err, data) {
      if (err) {
        message.channel.send('```' + 'Server is offline or restarting' + '```');
      } else {
        var player = data.players;
        if (player == 0) {
          message.channel.send('There is currently no players on the server :frowning:'); 
        } else
          message.channel.send('```' + 'Number of players online: ' + data.raw.numplayers + '/' + data.maxplayers + '```');
        for (var i in player) {
          message.channel.send('```' + player[i].name + ' - Score: ' + player[i].score + ' - Time In Game: ' + timeFormat(player[i].time) + '```');
        }
      }
    });
  }

  if (command === 'serverbilgi') {
    Gamedig.query({
      type: game,
      host: host,
      port: port
    },
    function(err, data) {
      if (err) {
        message.channel.send('```' + 'Server is offline or restarting' + '```');
      } else {
        message.channel.send('```' + 'Server Name: ' + data.name + '\n' + 'Map: ' + data.map + '\n' + 'players online: ' + data.raw.numplayers + '/' + data.maxplayers + '\n' + 'Server Ip/Port: ' + data.query.host + ':' + data.query.port + '```');
        var player = data.players;
        for (var i in player) {
          message.channel.send('```' + player[i].name + ' - Score: ' + player[i].score + ' - Time In Game: ' + timeFormat(player[i].time) + '```');
        }
      }
    });
  }
  
  if (command === "search") {
    var ip = args.slice(0, 1).join(' ').toUpperCase();
    var p = args.slice(1, 2).join(' ').toUpperCase();
    if ( !ip && !p || ip && p < 2 ) {
      message.channel.send('Error! make sure the servers ip and port are correct  \nPlease use example ' + '`!search 45.121.211.65 2302`');
    } else
    if ( !p.match(/^\d+$/) ) {
      message.channel.send('Error port is numeric only');
    } else
    Gamedig.query({
      type: game,
      host: ip,
      port: p
    },
    function(err, data) {
      if (err) {
        message.channel.send('```' + 'Server is offline or restarting' + '```');
      } else {
        message.channel.send('```' + 'Server Name: ' + data.name + '\n' + 'Map: ' + data.map + '\n' + 'players online: ' + data.raw.numplayers + '/' + data.maxplayers + '\n' + 'Server Ip/Port: ' + data.query.host + ':' + data.query.port + '```');
      }
    });
  }
  /* End Arma 3 Stats */

  /* PUBG Stats */
  if (command === "pubg") {
    var playerVar = args.slice(0, 1).join(' ');
    if ( !playerVar || playerVar < 2 ) {
      message.channel.send('Error! make sure you add a player name.\n' + '\nExample: `!pubg AHappyTeddyBears`');
    } else
    api.getProfileByNickname(playerVar)
    .then((profile) => {
      const data = profile.content;
      const stats = profile.getStats({
        region: REGION.ALL,
        season: SEASON.EA2017pre4,
        match: MATCH.SOLO
      });
      message.channel.send('```' + stats.playerName + "'s SOLO Stats" +
      '\nPlayer Rank: ' + stats.rankData.rating +
      '\nRounds Played: ' + stats.performance.roundsPlayed +
      '\nTotal Kills: ' + stats.combat.kills +
      '\nK/D Ratio: ' + stats.performance.killDeathRatio +
      '\nHeadShot Kills: ' + stats.combat.headshotKills +
      '\nHeadShot Kill Ratio: ' + stats.combat.headshotKillRatio + '%' +
      '\nWins: ' + stats.performance.wins +
      '\nWin Ratio: ' + stats.performance.winRatio + '%' +
      '\nLosses: ' + stats.performance.losses +
      '\nTop 10s: ' + stats.performance.top10s +
      '\nTop 10 Ratio: ' + stats.performance.top10Ratio + '%' +
      '```');
    })
    .catch((err) => {
      message.channel.send('```' + 'Error: ' + playerVar + ' not found for season 4 or server is busy. Try again later' + '```');
    });
  }

  if (command === "pubgduo") {
    var playerVar = args.slice(0, 1).join(' ');
    if ( !playerVar || playerVar < 2 ) {
      message.channel.send('Error! make sure you add a player name.\n' + '\nExample: `!pubg AHappyTeddyBears`');
    } else
    api.getProfileByNickname(playerVar)
    .then((profile) => {
      const data = profile.content;
      const stats = profile.getStats({
        region: REGION.ALL,
        season: SEASON.EA2017pre4,
        match: MATCH.DUO
      });
      message.channel.send('```' + stats.playerName + "'s DUO Stats" +
      '\nPlayer Rank: ' + stats.rankData.rating +
      '\nRounds Played: ' + stats.performance.roundsPlayed +
      '\nTotal Kills: ' + stats.combat.kills +
      '\nK/D Ratio: ' + stats.performance.killDeathRatio +
      '\nHeadShot Kills: ' + stats.combat.headshotKills +
      '\nHeadShot Kill Ratio: ' + stats.combat.headshotKillRatio + '%' +
      '\nWins: ' + stats.performance.wins +
      '\nWin Ratio: ' + stats.performance.winRatio + '%' +
      '\nLosses: ' + stats.performance.losses +
      '\nTop 10s: ' + stats.performance.top10s +
      '\nTop 10 Ratio: ' + stats.performance.top10Ratio + '%' +
      '```');
    })
    .catch((err) => {
      message.channel.send('```' + 'Error: ' + playerVar + ' not found for season 4 or server is busy. Try again later' + '```');
    });
  }
  
  if (command === "pubgsquad") {
    var playerVar = args.slice(0, 1).join(' ');
    if ( !playerVar || playerVar < 2 ) {
      message.channel.send('Error! make sure you add a player name.\n' + '\nExample: `!pubg AHappyTeddyBears`');
    } else
    api.getProfileByNickname(playerVar)
    .then((profile) => {
      const data = profile.content;
      const stats = profile.getStats({
        region: REGION.ALL,
        season: SEASON.EA2017pre4,
        match: MATCH.SQUAD
      });
      message.channel.send('```' + stats.playerName + "'s SQUAD Stats" +
      '\nPlayer Rank: ' + stats.rankData.rating +
      '\nRounds Played: ' + stats.performance.roundsPlayed +
      '\nTotal Kills: ' + stats.combat.kills +
      '\nK/D Ratio: ' + stats.performance.killDeathRatio +
      '\nHeadShot Kills: ' + stats.combat.headshotKills +
      '\nHeadShot Kill Ratio: ' + stats.combat.headshotKillRatio + '%' +
      '\nWins: ' + stats.performance.wins +
      '\nWin Ratio: ' + stats.performance.winRatio + '%' +
      '\nLosses: ' + stats.performance.losses +
      '\nTop 10s: ' + stats.performance.top10s +
      '\nTop 10 Ratio: ' + stats.performance.top10Ratio + '%' +
      '```');
    })
    .catch((err) => {
      message.channel.send('```' + 'Error: ' + playerVar + ' not found for season 4 or server is busy. Try again later' + '```');
    });
  }
/* End PUBG Stats */
});

client.login(clientToken);
