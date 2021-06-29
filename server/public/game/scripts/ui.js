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