const fs = require('fs');

module.exports = () => {
  const env = fs.readFileSync(__dirname + '/.env', { encoding: 'utf-8' });
  let gettingVarName = true;
  let varStr = '';
  let varVal = '';
  for (let i = 0; i < env.length; i++) {
    if (env[i] === '\n') {
      gettingVarName = true;
      process.env[varStr] = varVal;
      varStr = '';
      varVal = '';
    } else if (i + 1 === env.length) {
      varVal += env[i];
      process.env[varStr] = varVal;
    } else if (env[i] === '=') {
      gettingVarName = false;
    } else if (gettingVarName) {
      varStr += env[i];
    } else {
      varVal += env[i];
    }
  }
}