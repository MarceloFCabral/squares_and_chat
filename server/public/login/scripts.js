var password = '';
document.querySelector('#password').value = '';
document.querySelector('#username').value = '';

document.querySelector('#password').addEventListener('input', e => {
  const inputVal = e.target.value;
  if (inputVal.length < password.length) {
    password = password.substring(0, inputVal.length);
  } else {
    password += inputVal[inputVal.length - 1];
    e.target.value = inputVal.substring(0, inputVal.length - 1) + '\u25cf';
  }
});

function register() {
  const username = document.querySelector('#username').value;
  if (username.length === 0) {
    alert('Please enter a username!');
    return;
  }

  if (password.length === 0) {
    alert('Please enter a password!');
    return;
  }

  fetch('http://localhost:8000/register', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({username, password})
  }).then(async res => {
    if (res.status === 200) {
      alert("Registration successful! You may now log in.");
    } else {
      res = await res.json();
      alert("Error: " + res.msg);
    }
  });
}

//gets user and square data (no hashing/cryptography happening yet. Use JWT lib later)
function login() {
  const username = document.querySelector('#username').value;
  if (username.length === 0) {
    alert('Please enter a username!');
    return;
  }

  if (password.length === 0) {
    alert('Please enter a password!');
    return;
  }

  fetch('http://localhost:8000/login', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({username, password})
  }).then(async res => {
    if (res.status === 200) {
      res = await res.json();
      //check if this is working properly
      window.localStorage.setItem('userData',
        JSON.stringify(res.msg)
      );
      console.log("data saved in the local storage =", window.localStorage.getItem('userData'));
      window.location = 'http://localhost:8000/game'
    }
  });
}