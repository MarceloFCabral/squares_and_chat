/*
--------------------------------
| UI FUNCTIONS AND CONSTANTS |
--------------------------------
*/

//UI and events control globals
var isResizingChat = false;
var isShooting = false;
//var shootingInterval = null;
var lastShootingClickTime = 0;
var mouseX = 0;
var mouseY = 0;
const SQUARE_SIDE = 100;

// function that checks if the player is shooting each 10 ms. If the player is shooting, the checking interval is cleared and the engine
// sets the shooting interval through setShootingIntv.
const checkIfShootingIntv = () => {
  const intvId = setInterval(() => {
    if (isShooting) {
      clearInterval(intvId);
      setShootingIntv();
    }
  }, 5);
};

// function that executes shoot every 300 ms. If the player is not shooting, the shooting interval is cleared and the engine goes back to checking
// if the player is shooting.
const setShootingIntv = () => {
  const intvId = setInterval(() => {
    const userSquare = document.getElementById(userData.username);
    userSquare.centerX = (parseInt(userSquare.style.left) + (parseFloat(userSquare.style.width) / 2));
    userSquare.centerY = (parseInt(userSquare.style.top) + (parseFloat(userSquare.style.height) / 2));
    shoot(userSquare, mouseX, mouseY);
    if (!isShooting) {
      clearInterval(intvId);
      checkIfShootingIntv();
    }

  }, 300);
};

const setUiEvents = () => {
  checkIfShootingIntv();
  const chatbar = document.querySelector('.chatbar');
  chatbar.addEventListener('mousedown', e => {
    isResizingChat = true;
  });

  window.addEventListener('mousedown', e => {
    // only the user/client is able to shoot so far
    if (!isResizingChat) {
      isShooting = true;
      //const userSquare = document.getElementById(userData.username);
      // shoot
      //userSquare.centerX = (parseInt(userSquare.style.left) + (parseFloat(userSquare.style.width) / 2));
      //userSquare.centerY = (parseInt(userSquare.style.top) + (parseFloat(userSquare.style.height) / 2));
      //shoot(userSquare, e.clientX, e.clientY);
    }
  });

  // @TODO limit chat height
  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (isResizingChat) {
      increaseChatHeight(e.clientY);
    }
  });

  window.addEventListener('mouseup', e => {
    isResizingChat = false;
    isShooting = false;
    //clearInterval(shootingInterval);
  });
};

const increaseChatHeight = (newY) => {
  const game = document.querySelector('.game');
  const chat = document.querySelector('.chat');
  const chatbar = document.querySelector('.chatbar');
  game.style.height = newY - parseInt(chatbar.style.height) / 2 + 'px';
  chat.style.height = window.innerHeight - newY + 'px';
};

setUiEvents();

/*
--------------------------------
| GAME FUNCTIONS AND CONSTANTS |
--------------------------------
*/

const SINGLE_MOV_DIST = 6;

//const PROJ_X_MOV_DIST = 6;
//const PROJ_Y_MOV_DIST = 6;
const PROJ_MOV_DIST = 25/*18*/;

const keys = {};

const lerp = (currX, aX, aY, bX, bY) => ((aY * (bX - currX) + bY * (currX - aX)) / (bX - aX));

const moveProjectile = (proj, p0X, p0Y, mX, mY, sin, cos) => {
  const left = parseInt(proj.style.left);
  const top = parseInt(proj.style.top);
  if (p0Y > mY)
    proj.style.top = top - Math.abs(sin) * PROJ_MOV_DIST + 'px';
  else
    proj.style.top = top + Math.abs(sin) * PROJ_MOV_DIST + 'px';

  if (p0X > mX)
    proj.style.left = left - Math.abs(cos) * PROJ_MOV_DIST + 'px';
  else
    proj.style.left = left + Math.abs(cos) * PROJ_MOV_DIST + 'px';
};

const getDistance = (aX, aY, bX, bY) => {
  let diffX = bX - aX;
  let diffY = bY - aY;
  return Math.sqrt(diffX * diffX + diffY * diffY);
};

const getProjAngle = (pX, pY, mX, mY) => {
  // get the distance between the player and the mouse pointer
  let d = getDistance(pX, pY, mX, mY);

  // calculate the sine/cosine using the given coordinates and the found distance
  let sin = (mY - pY) / d;
  let cos = (mX - pX) / d;

  // use arcsine/arccos to find the angle in radians
  let radians = Math.asin(sin);

  // convert radians to degrees
  let degrees = radians * (180 / Math.PI);

  // check if the angle is > 90deg and, if it is, get the symmetric angle in the opposit quadrant
  if (mX - pX < 0) degrees = 180 - degrees;
  
  // return the angle in degrees
  return { degrees, sin, cos };
};

const registerHit = () => {

};

const shoot = (userSquare, mX, mY) => {
  const game = document.querySelector('.game');
  const cX = userSquare.centerX;
  const cY = userSquare.centerY;
  // only the user/client is able to shoot so far
  //const userSquare = document.getElementById(userData.username);
  console.log("userSquare =", userSquare);
  // render projectile (a div) with the correct rotation
  const projectile = document.createElement('div');
  setProjStyle(projectile, userSquare);
  console.log("projectile =", projectile);
  //console.log("projectile angle =", getProjAngle(cX, cY, mX, mY));
  const angleData = getProjAngle(cX, cY, mX, mY);
  projectile.style.transform = `rotate(${angleData.degrees}deg)`;
  game.appendChild(projectile);

  // make the projectile go towards where the mouse was pointing to when the user clicked
  // check for a hit every X milliseconds (<- TODO) or if the projectile went out of the viewport's boundaries
  // TODO -> if a user was hit or the projectile went out of bounds, remove the node from the HTML tree and register hit
  const intervalId = setInterval(() => {
    const left = parseInt(projectile.style.left);
    const top = parseInt(projectile.style.top);
    if (left < 0|| left > window.innerWidth ||
        top < 0 || top > window.innerHeight)
    {

      console.log('projectile out of bounds');

      clearInterval(intervalId);
      projectile.remove();

    } else {

      moveProjectile(projectile, cX, cY, mX, mY, angleData.sin, angleData.cos);

    }
  }, 30);
  
};

const moveSquare = () => {
  const square = document.querySelector('#' + userData.username);
  for (let key in keys) {
    if (key === 'w') {
      square.style.top = parseInt(square.style.top) - SINGLE_MOV_DIST + 'px';
      sendData('player_data');
    }
    
    if (key === 'a') {
      square.style.left = parseInt(square.style.left) - SINGLE_MOV_DIST + 'px';
      sendData('player_data');
    }
    
    if (key === 's') {
      square.style.top = parseInt(square.style.top) + SINGLE_MOV_DIST + 'px';
      sendData('player_data');
    }
    
    if (key == 'd') {
      square.style.left = parseInt(square.style.left) + SINGLE_MOV_DIST + 'px';
      sendData('player_data');
    }
  }
};

const configWindow = () => {
  window.addEventListener('keydown', e => {
    if (e.key === 'w' || e.key === 'a' || e.key === 's' || e.key === 'd') {
      keys[e.key] = true;
    }
  });
  window.addEventListener('keyup', e => {
    if (e.key === 'w' || e.key === 'a' || e.key === 's' || e.key === 'd') {
      delete keys[e.key];
    }
  });
}

configWindow();
setInterval(moveSquare, 10);

/*
-----------------------------------
| NETWORK FUNCTIONS AND CONSTANTS |
-----------------------------------
*/

const PROJ_WIDTH = 80;
const PROJ_HEIGHT = 20;
const PROJ_COLOR = 'grey';

const SERVER_URL = "ws://localhost:8000";
const socket = new WebSocket(SERVER_URL);
const msgTypes = {
  // input/output related to the sendMessage function
  TEXT: 'text', // i/o
  USER_DATA: 'user_data', // output only
  PLAYER_DATA: 'player_data', // i/o
  DISCONN: 'disconnection', // input only (player disconnection notice)
  SHOT_DATA: 'shot_data' // i/o
};

//find a way to store user data fetched in scripts.js
var userData = JSON.parse(window.localStorage.getItem('userData'));

// set initial user position
const getRandomPos = () => {
  const top = Math.floor(Math.random() * (window.innerHeight - SQUARE_SIDE));
  const left = Math.floor(Math.random() * (window.innerWidth - SQUARE_SIDE));
  return { top, left };
};

// generate projectile
const generateProjectile = projData => {
  const newProjectile = document.createElement('div');
  newProjectile.id = 'p' + projData.username;
  setProjStyle(newProjectile);
};

// set projectile style
const setProjStyle = proj => {
  const shooter = document.getElementById(proj.id.substring(1));
  proj.style.position = 'absolute';
  proj.style.left = shooter.centerX - PROJ_WIDTH / 2 + 'px';
  proj.style.top = shooter.centerY - PROJ_HEIGHT / 2 + 'px';
  console.log("projectile left =", proj.style.left);
  console.log("projectile top =", proj.style.top);
  proj.style.width = PROJ_WIDTH + 'px';
  proj.style.height = PROJ_HEIGHT + 'px';
  proj.style.backgroundColor = PROJ_COLOR;
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

    } else if (msgObj.type === msgTypes.SHOT_DATA) {

      console.log("got shot data");
      shoot(document.getElementById(msgObj.username), msgObj.mX, msgObj.mY);

    } else if (msgObj.type === msgTypes.DISCONN) {

      console.log('got disconnection message');
      document.getElementById(msgObj.username).remove();
      
    }
  });
};

const sendData = (type, mX, mY) => {
  if (type === msgTypes.TEXT) {
    let text = document.querySelector('#msg').value;
    socket.send(JSON.stringify({
      type,
      text,
    }));
  } else if (type === msgTypes.SHOT_DATA) {
    socket.send(JSON.stringify({
      type,
      username: userData.username,
      mX,
      mY
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