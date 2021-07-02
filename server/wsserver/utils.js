const path = require('path');
const fs = require('fs');
//const db = require('../db');

const FILES_PATH = path.normalize(__dirname + '/../public/');


/**
 * Streams a file with a 200 status code.
 * @param {writableStream} res 
 * @param {string} file 
 * @param {string} mimeType 
 */

const streamFile = (res, dirAndFile, mimeType) => {
  res.writeHead(200, {'Content-Type': mimeType});
  fs.createReadStream(FILES_PATH + dirAndFile).pipe(res);
}

/**
 * Adds callbacks to the req stream events object, ultimately buffering the body in a string and calling
 * a callback function on the end, passing the (JSON.parsed) body as argument.
 * @param {readableStream} req 
 * @param {function} callback 
 */
const processBody = (req) => {
  return new Promise(res => {
    let body = '';
    req.on('data', chunk => {
      //console.log(chunk);
      body += chunk;
    });
    req.on('end', () => {
      req.body = JSON.parse(body);
      res();
    });
  });
};

/**
 * Responds to a request with a simple JSON body and a given status code.
 * @param {writableStream} res 
 * @param {integer} statusCode 
 * @param {string} msg 
 */
const sendStdRes = (res, statusCode, msg) => {
  res.writeHead(statusCode, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({
    msg
  }));
};

module.exports = {
  streamFile,
  processBody,
  sendStdRes
}