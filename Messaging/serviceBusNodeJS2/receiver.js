var azure = require('azure');
var keyVault = require('./keyvault.js');

const AZURE_SERVICEBUS_NAMESPACE = 'workshopmessagingretail ';

keyVault.getSecretPromise()
                .then(function(connectionString){
                        var serviceBusService = azure.createServiceBusService(connectionString);                                            

                        serviceBusService.receiveQueueMessage('myqueue', function(error, receivedMessage){
                            if(!error){
                                // Message received and deleted
                                console.log("Mensaje recibido :"+ receivedMessage.body);
                            }
                        });

                                  
                })
                .catch(function(error){
                    console.log(error);
                });