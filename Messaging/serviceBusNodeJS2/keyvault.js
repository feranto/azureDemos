'use strict';
var keyVault = require('azure-keyvault');
var AuthenticationContext = require('adal-node').AuthenticationContext;

var clientId = '726a46c2-21e1-45ee-96cf-c6ca559d7729';
var clientSecret = 'b9a440e1-7625-4bb7-b394-1fab0f4191f7';

var secretIdentifier = 'https://workshopmessagingretail.vault.azure.net/secrets/servicebusConnectionString/f83093fdde7c48d0a037f96dd6f2a6e2';

var credentials = new keyVault.KeyVaultCredentials(authenticator);
var client = new keyVault.KeyVaultClient(credentials);


module.exports = {

    
    getSecretPromise: function(){
        return new Promise(function(resolve,reject){
            var buffer = new Buffer("I'm a string!", "utf-8")

            client.getSecret(secretIdentifier)
                .then(function(result){
                    resolve(result.value)
                })
                .catch(function(error){
                    reject(error);
                });                
        });
    }

};


// Authenticator - retrieves the access token
function authenticator(challenge, callback) {

  // Create a new authentication context.
  var context = new AuthenticationContext(challenge.authorization);

  // Use the context to acquire an authentication token.
  return context.acquireTokenWithClientCredentials(challenge.resource, clientId, clientSecret, function (err, tokenResponse) {
    if (err) throw err;
    // Calculate the value to be set in the request's Authorization header and resume the call.
    var authorizationValue = tokenResponse.tokenType + ' ' + tokenResponse.accessToken;
    return callback(null, authorizationValue);
  });

};