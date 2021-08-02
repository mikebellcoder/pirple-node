/* 
* Node JS Masterclass by Pirple (homework repo)
* Primary file for the API
* Author: Mike Bell
*
*/

// Dependencies
var server = require('./lib/server');
var workers = require('./lib/workers');

// Declare the app
var app = {};

// Init function
app.init = function() {
    // Start the server
    server.init();
    // Start the workers
    workers.init();
};

// Execute
app.init();


// Export the app
module.exports = app;
