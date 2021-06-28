//UI control globals
var isResizingChat = false;
var isShooting = false;
//var mouseX = 0;
//var mouseY = 0;
const SQUARE_SIDE = 100;

const setUiEvents = () => {
  const chatbar = document.querySelector('.chatbar');
  chatbar.addEventListener('mousedown', e => {
    isResizingChat = true;
  });

  window.addEventListener('mousedown', e => {
    // only the user/client is able to shoot so far
    if (!isResizingChat) {
      const userSquare = document.getElementById(userData.username);
      // shoot
      shoot(userSquare, e.clientX, e.clientY);
    }
  });

  // @TODO limit chat height
  window.addEventListener('mousemove', e => {
    if (isResizingChat) {
      increaseChatHeight(e.clientY);
    }
  });

  window.addEventListener('mouseup', e => {
    isResizingChat = false;
    isShooting = false;
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