const http = require('http');
const webSocketServer = require('websocket').server;
const clients = {};
const su = require('./utils');
const User = require('../db/user'); //user "model"
const webSocketPort = 8000;

const getColor = () => ('#' + ((Math.floor(Math.random() * 0xFFFFFF) + 1) % 0xFFFFFF).toString(16));

// currently generating the player's initial position on the client's side
/*
const getRandomPos = () => {
  const top = Math.floor(Math.random() * (window.innerHeight - SQUARE_SIDE + 1));
  const left = Math.floor(Math.random() * (window.innerWidth - SQUARE_SIDE + 1));
  return { top, left };
};
*/

// make this work
const fetchPlayerData = connection => {
  console.log("--- fetch player data ---");
  console.log("connection.id =", connection.id);
  Object.keys(clients).forEach(id => {
    console.log("currClient.id =", id);
    const currClient = clients[id];
    if (currClient.id !== connection.id) {
      console.log("currClient color =", currClient.color);
      console.log("currClient top =", currClient.top);
      console.log("currClient left =", currClient.left);
      connection.send(JSON.stringify({
        type: 'player_data',
        username: currClient.username,
        color: currClient.color,
        top: currClient.top,
        left: currClient.left
      }));
    }
  });
};

const sendMessage = msg => {
  const msgObj = typeof msg !== 'object' ? JSON.parse(msg) : msg; // if the msg is not of the 'position' type, userId will be undefined.
  //console.log("msgObj =", msgObj);
  const userId = msgObj.id;
  //console.log("userId =", msgObj.id);
  if (msgObj.type === 'player_data') delete msgObj.id;
  if (msgObj.type !== 'user_data') {
    console.log(Object.keys(clients));
    Object.keys(clients).forEach(id => {
      //console.log("client id =", id);
      if (id !== userId) {
        //console.log("msgObj inside sendMEssage =", msgObj);
        clients[id].conn.send(JSON.stringify(msgObj));
      }
    });
  }
};

const setUpServer = () => {
  const httpServer = http.createServer((req, res) => {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    const url = req.url;
    if (url === '/') {
      su.streamFile(res, 'login/login.html', 'text/html');
    } else if (url === '/style') {
      su.streamFile(res, 'login/style.css', 'text/css');
    } else if (url === '/scripts') {
      su.streamFile(res, 'login/scripts.js', 'text/javascript');
    } else if (url === '/gamescript') {
      su.streamFile(res, 'game/game.js', 'text/javascript');
    } else if (url === '/gamestyle') {
      su.streamFile(res, 'game/style.css', 'text/css');
    } else if (url === '/register') {
      su.processBody(req).then(() => {
        User.create(req.body.username, req.body.password).then(dbRes => {
          su.sendStdRes(res, dbRes.status, dbRes.msg);
        });  
      });
    } else if (url === '/login') {
      console.log('login received');
      su.processBody(req).then(() => {
        User.read(req.body.username, req.body.password).then(dbRes => {
          if (dbRes.user) {
            const color = getColor();
            //clients[dbRes.user.id] = { ...dbRes.user, color };
            //const { username, id, square_id } = dbRes.user;
            clients[dbRes.user.id] = { ...dbRes.user, id: dbRes.user.id.toString(), color };
            su.sendStdRes(res, dbRes.status, clients[dbRes.user.id]);
          }
        });
      });
    } else if (url === '/game') {
      su.streamFile(res, 'game/index.html', 'text/html');
    }
  });

  httpServer.listen(webSocketPort, () => {
    console.log('Server listening on port ' + webSocketPort);
  });

  const wsServer = new webSocketServer({
    httpServer
  });

  console.log('websocket server created');

  wsServer.on('request', request => {
    var connection = request.accept(null, request.origin);
    console.log('wsServer request event emitted');
    
    //connection.send({ type: 'user_data', color: getColor() });
    
    connection.once('message', message => {
      console.log("once -> message.utf8Data received =", message.utf8Data);
      const playerData = JSON.parse(message.utf8Data);
      connection.id = playerData.id; // modifying the standard connection object to include the user's id so we can delete user data when he/she disconnects
      console.log('connection.id =', connection.id);
      const clientData = clients[playerData.id];
      clientData.conn = connection;
      clientData.top = playerData.top;
      clientData.left = playerData.left;
      fetchPlayerData(connection);
      //const id = JSON.parse(message.utf8Data).id; //parseInt(message.utf8Data);
      console.log("User of id " + playerData.id + " has connected.");
      // unnecessary data duplication occurring here. Think about a way to store the id only once
      sendMessage({
        type: 'player_data',
        username: clientData.username,
        color: clientData.color,
        //id: playerData.id,
        top: playerData.top,
        left: playerData.left
      });
    });

    //console.log('Connected: ' + idObj.id + ' in ' + Object.getOwnPropertyNames(clients));

    connection.on('message', message => {
      const msgObj = JSON.parse(message.utf8Data);
      console.log("Message from " + '(' + msgObj.id + ')' + ": " + message.utf8Data);
      if (msgObj.type === 'player_data') {
        const client = clients[msgObj.id];
        client.left = msgObj.left;
        client.top = msgObj.top;
      }
      sendMessage(message.utf8Data);
    });

    connection.on('close', reasonCode => {
      console.log((new Date()) + ' User ' + connection.id + ' disconnected.');
      sendMessage({
        type: 'disconnection',
        username: clients[connection.id].username
      });
      delete clients[connection.id];
      console.log('-- currently connected clients --');
      Object.keys(clients).forEach(id => console.log(id));
    });
  });
}

module.exports = setUpServer;