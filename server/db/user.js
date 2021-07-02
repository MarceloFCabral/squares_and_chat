const db = require('./index');
const User = {};


/*
const QUERIES = {

};
*/
/*
function User(id, username, password, square_id) {
  this.id = id;
  this.username = username;
  this.password = password;
  this.square_id = square_id;
}
*/
//TODO: hash password
User.create = async function(username, password) {
  let res = {};
  const usersRows = await db.query('SELECT id FROM users WHERE username = $1', [username]);
  if (usersRows.length > 0) {
    res.msg = 'Username already exists!';
    res.status = 400;
  } else {
    const rows = await db.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, password]);
    if (rows !== null) {
      res.msg = 'User successfully registered.';
      res.status = 200;
      res.user = rows[0];
    } else {
      res.msg = 'Database error.';
      res.status = 500;
    }
  }
  return res;
}

User.read = async function(username, password) {
  let res = {};
  const rows = await db.query('SELECT id, username, square_id FROM users WHERE username = $1 AND password = $2', [username, password]);
  if (!rows) {
    res.msg = 'Database error.';
    res.status = 500;
  } else if (rows.length > 0) {
    res.msg = 'User found.';
    res.status = 200;
    res.user = rows[0];
  } else {
    res.msg = 'User not found.';
    res.status = 404;
  }
  return res;
}

User.update = async function(id, columnsArr, valuesArr) {
  let res = {};
  const setStr = 'SET ' + columnsArr.map((column, idx) => column + ' = ' + valuesArr[idx]).join(', ');
  const rows = await db.query('UPDATE users ' + setStr + ' WHERE id = $1 RETURNING *', [id]);
  if (!rows) {
    res.msg = 'Database error.';
    res.status = 500;
  } else if (rows.length > 0) {
    res.msg = 'User updated.';
    res.status = 200;
    res.user = rows[0];
  } else {
    res.msg = 'User not found';
    res.status = 404;
  }
  return res;
}

User.delete = async function(id) {
  const rows = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
  if (!rows) {
    res.msg = 'Database error.';
    res.status = 500;
  } else if (rows.length > 0) {
    res.msg = 'User deleted.';
    res.status = 200;
  } else {
    res.msg = 'User not found.';
    res.status = 404;
  }
  return res;
}

module.exports = User;