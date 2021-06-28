const SINGLE_MOV_DIST = 6;

const PROJ_WIDTH = '100px';
const PROJ_HEIGHT = '35px';
const PROJ_COLOR = 'grey';
//const PROJ_X_MOV_DIST = 6;
//const PROJ_Y_MOV_DIST = 6;
const PROJ_MOV_DIST = 18;

const keys = {};

const lerp = (currX, aX, aY, bX, bY) => ((aY * (bX - currX) + bY * (currX - aX)) / (bX - aX));

const moveProjectile = (proj, p0X, p0Y, mX, mY, sin, cos) => {
  //proj.style.top = lerp(parseInt(proj.style.left), p0X, p0Y, mX, mY) + 'px';
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
  //proj.style.left = parseInt(proj.style.left) + PROJ_X_MOV_DIST + 'px';
};

const setProjStyle = (proj, userSquare) => {
  proj.style.position = 'absolute';
  proj.style.left = userSquare.centerX + 'px';
  proj.style.top = userSquare.centerY + 'px';
  console.log("projectile left =", proj.style.left);
  console.log("projectile top =", proj.style.top);
  proj.style.width = PROJ_WIDTH;
  proj.style.height = PROJ_HEIGHT;
  proj.style.backgroundColor = PROJ_COLOR;
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
//setInterval(sendData('player_data'), 40);
/*
const moveUp = () => {
  return new Promise(resolve => {
    let square = document.querySelector('#square');
    if (square.classList != 'animate') {
      square.classList.add('animate');
      setTimeout(() => {
        square.classList.remove('animate');
        resolve();
      }, 600);
    }
  });
};

const easeInSine = (x) => {
  return 1 - Math.cos((x * Math.PI) / 2);
};
*/