const SERVER_URL = "ws://localhost:8000";
const socket = new WebSocket(SERVER_URL);
const msgTypes = {
  TEXT: 'text', // i/o
  USER_DATA: 'user_data', // output only
  PLAYER_DATA: 'player_data', // input only
  DISCONN: 'disconnection' // input only (player disconnection notice)
};

//find a way to store user data fetched in scripts.js
var userData = JSON.parse(window.localStorage.getItem('userData'));

// set initial user position
const getRandomPos = () => {
  const top = Math.floor(Math.random() * (window.innerHeight - SQUARE_SIDE));
  const left = Math.floor(Math.random() * (window.innerWidth - SQUARE_SIDE));
  return { top, left };
};

// player generation functions
const generateNewPlayer = playerData => {
  console.log("playerData =", playerData);
  //const top = Math.floor(Math.random() * (window.innerHeight - SQUARE_SIDE + 1));
  //const left = Math.floor(Math.random() * (window.innerWidth - SQUARE_SIDE + 1));
  const newPlayer = document.createElement('div');
  console.log("newPlayer beginning =", newPlayer);
  newPlayer.style.position = 'absolute';
  newPlayer.id = playerData.username;
  newPlayer.style.top = playerData.top + 'px';
  newPlayer.style.left = playerData.left + 'px';
  newPlayer.style.backgroundColor = playerData.color;
  newPlayer.style.width = newPlayer.style.height = SQUARE_SIDE + 'px';
  newPlayer.style.zIndex = '1';
  // db
  const playerName = document.createElement('h3');
  playerName.innerHTML = playerData.username;
  newPlayer.appendChild(playerName);
  console.log("newPlayer end =", newPlayer);
  document.querySelector('.game').appendChild(newPlayer); 
};

const configSocket = () => {
  socket.addEventListener('open', event => {
    console.log('websocket open event');
    const initialPos = getRandomPos();
    generateNewPlayer({ ...userData, ...initialPos });
    const { top, left } = initialPos;
    socket.send(JSON.stringify({
      type: msgTypes.USER_DATA,
      id: userData.id,
      top,
      left
    }));
  });
  socket.addEventListener('message', event => {
    console.log("Message received from the server:", event.data);
    console.log(event.data);
    const msgObj = JSON.parse(event.data);
    if (msgObj.type === msgTypes.TEXT) {

      let newNode = document.createElement('h2');
      newNode.innerHTML = msgObj.text;
      document.getElementById("data").appendChild(newNode);

    } else if (msgObj.type === msgTypes.PLAYER_DATA) {

      console.log("got player data");
      let player = null;
      try {
        console.log("try block inside message event");
        console.log("username =", msgObj.username);
        player = document.getElementById(msgObj.username);
        console.log("player inside try block =", player);
        player.style.top = msgObj.top + 'px';
        player.style.left = msgObj.left + 'px';
      } catch (error) {
        console.log("catch block inside message event");
        console.log(error);
        generateNewPlayer(msgObj);
      }

    } else if (msgObj.type === msgTypes.DISCONN) {
      console.log('got disconnection message');
      document.getElementById(msgObj.username).remove();
      
    }
  });
};

const sendData = type => {
  if (type === msgTypes.TEXT) {
    let text = document.querySelector('#msg').value;
    socket.send(JSON.stringify({
      type,
      text,
    }));
  } else {
    let square = document.querySelector('#' + userData.username);
    socket.send(JSON.stringify({
      type,
      username: userData.username,
      top: parseInt(square.style.top),
      left: parseInt(square.style.left),
      id: userData.id
    }));
  }
};

configSocket();