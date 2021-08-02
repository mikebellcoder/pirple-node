/**
 * Worker-related tasks
 */


// Dependencies 
var path = require('path');
var fs = require('fs');
var _data = require('./data');
var https = require('https');
var http = require('http');
var helpers = require('./helpers');
var url = require('url');

// Instantiate the worker object
var workers = {};

// Lookup all checks, get their data, send to validator
workers.gatherAllChecks = function() {
    // Get all the checks
    _data.list('checks', function(err, checks) {
        if (!err && checks && checks.length > 0) {
            checks.forEach(function(check) {
                _data.read('checks', check, function(err, originalCheckData) {
                    if (!err && originalCheckData) {
                        // Pass it to the check validator, and let that function continue or log errors
                        workers.validateCheckData(originalCheckData);
                    } else {
                        console.log('Error reading one of the check\'s data');
                    }
                });
            });
        } else {
            console.log('Error: Could not find any checks to process')
        }
    })
};

// Sanity-check the check-data
workers.validateCheckData = function(originalCheckData) {
    originalCheckData = typeof originalCheckData === 'object' && originalCheckData !== null
    ? originalCheckData
    : {};
    originalCheckData.id = typeof originalCheckData.id === 'string' && originalCheckData.id.trim().length == 20
    ? originalCheckData.id.trim()
    : false;
    originalCheckData.userPhone = typeof originalCheckData.userPhone === 'string' && originalCheckData.userPhone.trim().length == 10
    ? originalCheckData.userPhone.trim()
    : false;
    originalCheckData.protocol = typeof originalCheckData.protocol === 'string' && ['https', 'http'].indexOf(originalCheckData.protocol) > -1
    ? originalCheckData.protocol
    : false;



};

// Timer to execute the worker-process once per minute
workers.loop = function() {
    setInterval(function() {
        workers.gatherAllChecks();
    }, 1000 * 60);
}

// Init script
workers.init = function init() {
    // Execute all the checks immediately
    workers.gatherAllChecks();
    // Call the loop so the cchecks will execute later on
    workers.loop();
}

// Export the module
module.exports = workers;