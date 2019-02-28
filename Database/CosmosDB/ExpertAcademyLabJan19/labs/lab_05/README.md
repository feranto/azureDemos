# Lab 5 - Deploying a Node.js Web API that can access your Cosmos instance via Mongo API

In this lab we will deploy the precerated app to connect to Cosmos DB via a Mongo API/ODM (Mongoose) via one (1) of three (3) optional ways:
1. locally with Node.JS --or--
2. Locally with a precreated Docker Image --or--
3. Remotely to Azure App Services - Web App for Containers

## Locally with Node (Optional)

You must have Node.js installed locally on your machine.

1. Navigate to the app directory (i.e. ```lab_05/app```)
2. Install the node dependencies with the following command: ```npm install```
3. Ensure that the CosmosDB Connection string is part of your environment variables ```export MONGOURI="<your.cosmosdb.connection.string>"```
4. Run the node app ```npm start```
5. You can now access the API locally at ```http://localhost:8080```

## Locally with Docker Image (Optional)

You must have Docker Engine installed for your particular OS [MacOS, Linux, Windows].

1. Ensure that the CosmosDB Connection string is part of your environment variables ```export MONGOURI="<your.cosmosdb.connection.string>"```
2. Start the precreated publically available container: ```docker run -it --rm -e MONGOURI -p 8080:8080 raykao/cosmos-demo-web-api```
3. You can now access the API locally at ```http://localhost:8080```

## Remotely to Azure App Service - Web App for Containers (Optional)

You must use an existing or create a new Linux App Service Plan and then deploy a Web App for Containers instance into that plan.

The precreated Docker image

1. Option (a) Deploy container via the Azure Portal
1. Option (b) Deploy container via the Azure-CLI