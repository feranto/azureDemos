var azure = require('azure');
var keyVault = require('./keyvault.js');

const AZURE_SERVICEBUS_NAMESPACE = '';

keyVault.getSecretPromise()
                .then(function(connectionString){
                        console.log(connectionString);
                        var serviceBusService = azure.createServiceBusService(connectionString);                                            

                        var queueOptions = {
                            MaxSizeInMegabytes: '5120',
                            DefaultMessageTimeToLive: 'PT1M'
                            };

                        serviceBusService.createQueueIfNotExists('myqueue', queueOptions, function(error){
                            if(!error){
                                // Queue exists
                                var message = {
                                    body: 'Test message',
                                    customProperties: {
                                        testproperty: 'TestValue'
                                    }};
                                serviceBusService.sendQueueMessage('myqueue', message, function(error){
                                    if(!error){
                                        // message sent
                                        console.log("message sent");
                                    }
                                });
                            }
                        });

                                  
                })
                .catch(function(error){
                    console.log(error);
                });
