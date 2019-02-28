# Lab 3 - Demo: accessing via a different wire protocol API (i.e. Mongo && SQL)

This lab is primarily an instructor led demo.  You can follow along given the provided instructions.

## Preface

Cosmos DB is a multi model API database.  What this means is that it is able to map/project the underlying records/documents to the corresponding Database Model and API types regardless of what your primary API type is.  In other words, if you initially create your Cosmos DB account with a primary API (e.g. SQL) you will still be able to query against your Account with the other APIs as well (i.e. Mongo, Gremlin, Table, Cassandra).

This allows you to have greater flexibility in your applications reading/writing to your Database depending on the type of data structure you wish to use with the same information stored.

**Note** There are limitations to this as some properties and primitive concepts in one Database engine are not necessarily mapped 1:1 or are non-existent.  As an example, properties in a document created in SQL API/Model with a leading underscore ``_`` in it's name are not returned when queried from a Mongo API/Client.

## Requirements
1. Mongo Command Line Interface (CLI) aka. Mongo Client

## Connection

Connecting to your Cosmos DB via Mongo CLI you will need:
1. Your Cosmos DB Account Name
2. Your Database Name
```
documents.azure.com:10255/<your database name>
```
3. One of your Cosmos DB account's Access Keys

## Commands

```shell
# example mongodb://[username:password@]host1[:port1][/[database][?options]]

# with docker container
docker run -it --rm mongo:3.6 mongo --host <cosmos_accountname>.documents.azure.com --port 10255 --ssl --username <cosmos_accountname> --password <primary_or_secondary_key>

mongodb://<cosmos_accountname>:<primary_or_secondary_key>@<cosmos_accountname>.documents.azure.com:10255/<database_name>?ssl=true

> show dbs
> use <db_name>
> show collections
> db.<collection_name>.findOne()
```