## What is Squares & Chat? ##
This project was born from the idea of creating a multiplayer game in JavaScript using as little dependencies as possible.
The idea is to have a server handling traditional HTTP requests in a REST API format (creating/reading/updating/deleting new user/square/score data) and also provide a small overhead, bidirectional server and client communication process using web sockets.
On the front-end, I challenged myself to create a basic user interface and game engine using only vanilla HTML, CSS and JavaScript. All the animations and game features are to be implemented from scratch.

## How it works ##
After registering (CRUD operations and database management are done using node-postgres), users are able to log in and establish a web socket connection (which uses the browser's standard WebSocket API) with the server (which uses theturtle32's websocket NPM package). Data from each client (such as the player's square position and current health, user data and disconnection notices) are sent to the server, which broadcasts the data to all the clients connected at the time the data was received with little overhead.

Each of the clients'/players' DOM gets changed according to the data received (i.e. if a player 1 moved to position (X, Y), player 2's local representation of player 1's square moves to (X, Y) aswell).

Still a lot of stuff to implement... the number of ideas seems to be infinite.