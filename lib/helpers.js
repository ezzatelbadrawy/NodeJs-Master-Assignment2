/*
 * Helpers for various tasks
 *
 */

// Dependencies
var config = require('./config');
var crypto = require('crypto');
var https = require('https');
var querystring = require('querystring');
var util = require('util');
var debug = util.debuglog('helpers');


// Container for all the helpers
var helpers = {};


// Validate user email
helpers.validateEmail  = function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function(str){
  try{
    var obj = JSON.parse(str);
    return obj;
  } catch(e){
    return {};
  }
};

// Create a SHA256 hash
helpers.hash = function(str){
  if(typeof(str) == 'string' && str.length > 0){
    var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
};

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = function(strLength){
  strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
  if(strLength){
    // Define all the possible characters that could go into a string
    var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // Start the final string
    var str = '';
    for(i = 1; i <= strLength; i++) {
        // Get a random charactert from the possibleCharacters string
        var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
        // Append this character to the string
        str+=randomCharacter;
    }
    // Return the final string
    return str;
  } else {
    return false;
  }
};

// Payment process using stripe apis
helpers.doPayment = function(price,orderId,callback){
    // Validate parameters
    price = typeof(price) == 'number' && price > 0 ? price : false;
    orderId = typeof(orderId) == 'string' && orderId.trim().length == 20 ? orderId.trim() : false;        
    if(price && orderId){
        // Configure the request payload
        var payload = {
          'currency' : 'usd',
          'amount' : price,
          'description' : 'payment of order #'+orderId,
          'source' : 'tok_visa'        
        };
        var stringPayload = querystring.stringify(payload);

        // Configure the request details
        var requestDetails = {
          'protocol' : 'https:',
          'hostname' : 'api.stripe.com',
          'method' : 'POST',
          'path' : '/v1/charges',
          'headers' : {
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(stringPayload),
            'Authorization': 'Bearer '+ config.stripe.secret          
          }
        };

        // Instantiate the request object
        var req = https.request(requestDetails,function(res){
            // Grab the status of the sent request
            var status =  res.statusCode;
            // Callback successfully if the request went through
            if(status == 200 || status == 201){
              callback(false);      // success
            } else {
              callback('Status code returned was '+status);
            }
            
            /*
            // Print response for debugging
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                debug('stripe-response: ' + chunk);
            });
            */            
        });

        // Bind to the error event so it doesn't get thrown
        req.on('error',function(e){
          callback(e);
        });

        // Add the payload
        req.write(stringPayload);

        // End the request
        req.end();
      
    } else {
        callback('Given parameters were missing or invalid');
    }
};

// Send email notification using mailgun apis
helpers.sendEmailNotification = function(toEmail,msg,callback){
    // Validate parameters
    toEmail = typeof(toEmail) == 'string' && toEmail.trim().length > 0 && helpers.validateEmail(toEmail.trim()) ? toEmail.trim() : false;
    msg = typeof(msg) == 'string' && msg.trim().length > 0 ? msg.trim() : false;
    if(toEmail && msg){
        // Configure the request payload
        var payload = {
          'from' : config.mailgun.fromEmail,
          'to' : toEmail,
          'subject' : 'Pizza Order Receipt',        
          'text' : msg
        };
        //var stringPayload = JSON.stringify(payload);
        var stringPayload = querystring.stringify(payload);
                
        // Configure the request details
        var requestDetails = {
          'protocol' : 'https:',
          'hostname' : 'api.mailgun.net',
          'method' : 'POST',
          'path' : '/v3/'+config.mailgun.domain+'/messages',
          //'auth' : 'api:'+config.mailgun.apiKey,
          'headers' : {
            //'Content-Type' : 'application/json',
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(stringPayload),
            'Authorization' : 'Basic '+config.mailgun.apiKeyBase64
          }
        };

        // Instantiate the request object
        var req = https.request(requestDetails,function(res){
            // Grab the status of the sent request
            var status =  res.statusCode;
            // Callback successfully if the request went through
            if(status == 200 || status == 201){
              callback(false);      // success
            } else {
              callback('Status code returned was '+status);
            }

            // Print response for debugging
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                debug('mailgun-response: ' + chunk + ', Status-Code: ' +status);
            });                        
        });

        // Bind to the error event so it doesn't get thrown
        req.on('error',function(e){
          callback(e);
        });

        // Add the payload
        req.write(stringPayload);

        // End the request
        req.end();
        
    } else {
        callback('Given parameters were missing or invalid');
    }
};

// Export the module
module.exports = helpers;
