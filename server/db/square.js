const db = require('./index');
const Square = {};
//const STD_STAT_VAL = 1;

Square.create = async function(userId) {
  let res = {};
  const rows = await db.query(
    'INSERT INTO squares (user_id, hp, mp, armor, p_atk, m_atk, m_spd, a_spd, m_def) ' +
    'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
    [userId, 1, 1, 1, 1, 1, 1, 1, 1]
  );
  if (!rows) {
    res.msg = 'Database error.';
    res.status = 500;
  } else {
    res.msg = 'Square successfully created.';
    res.status = 200;
    res.square = rows[0];
  }
  return res;
}

Square.read = async function(userId) {
  let res = {};
  const rows = await db.query('SELECT * FROM squares WHERE user_id = $1', [userId]);
  if (!rows) {
    res.msg = 'Database error.';
    res.status = 500;
  } else if (rows.length > 0) {
    res.msg = 'Square found.';
    res.status = 200;
    res.square = rows[0];
  } else {
    res.msg = 'Square not found.';
    res.status = 404;
  }
  return res;
}

Square.update = async function(id, columnsArr, valuesArr) {
  let res = {};
  const setStr = 'SET ' + columnsArr.map((column, idx) => column + ' = ' + valuesArr[idx]).join(', ');
  const rows = await db.query('UPDATE squares ' + setStr + ' WHERE id = $1 RETURNING *', [id]);
  if (!rows) {
    res.msg = 'Database error.';
    res.status = 500;
  } else if (rows.length > 0) {
    res.msg = 'Square updated.';
    res.status = 200;
    res.user = rows[0];
  } else {
    res.msg = 'Square not found';
    res.status = 404;
  }
  return res;
}

Square.delete = async function(id) {
  const rows = await db.query('DELETE FROM squares WHERE id = $1 RETURNING id', [id]);
  if (!rows) {
    res.msg = 'Database error.';
    res.status = 500;
  } else if (rows.length > 0) {
    res.msg = 'Square deleted.';
    res.status = 200;
  } else {
    res.msg = 'Square not found.';
    res.status = 404;
  }
  return res;
}

module.exports = Square;