# Lab 2 - Inserting/Updating/Querying via the Azure Portal as the Primary Interface

While the primary way to interact with your Cosmos DB instance is via an SDK, DB API Driver or native command line client (e.g. Mongo, SQL, Cassandra, Gremlin) for your programming language of choice, you can also interact with the database via the Azure Portal.

In the Azure portal you can execute queries and inspect the documents individually in the Data Explorer option in the left hand menu of the Cosmos DB Dashboard.  The Data Explorer experience will be different based on the API type your chose when you created your Cosmos DB Account.  This API choice defines what the Dashboard experience will be and how it treats documents in the portal.  You are however free to interact with the database/collections with which ever wire protocol or SDK you wish to leverage in your custom application.

In this lab, we will user our web browsers to navigate to the Azure Portal, create a new collection in our Database, add a new document, edit it directly in the portal then delete the document and collection.

1. Open your browser and navigate to the Azure Portal
1. Navigate to your Azure Cosmos DB instance
1. Click on **Add Collection**
1. In the Add Collection blade enter the following values:
    1. In the **Database ID** field use your existing database
    1. In the **Collection Id** field, enter ```temp``` as the value
        - we will delete this temporary collection at the end of this particular lab
    1. Under **Storage capacity** click ```Fixed 10GB```
    1. In the **Throughput** field, enter ```400```
    1. Click **Ok** at the bottom of the blade
1. Navigate to the **Data Explorer** in the left hand menu in the Cosmos DB Dashboard
1. Find your **temp** collection created above
1. This collection should be empty, add a document
    1. click on **New Document** button at the top of the File Explorer
    1. copy and replace the new document value with the following:  ```{ "hello": "World" }```
    1. click the **save** button at the top of the Data Explorer window
1. Edit the document
    1. You can edit the document by adding/editing/deleteting values directly into the document
    1. Make changes to your document
    1. Save changes by clicking the **Edit** button at the top of the Data Explorer window
1. Delete the document
    1. You can now delete the document by clicking the **Delete** button at the top of the Data Explorer window
1. Delete the Collection
    1. We no longer need this collection and can remove it
        1. select your collection in the Data Explorer
        1. click the **Delete Collection** button at the top of the Data Explorer window
        1. confirm deletion of this collection by entering the collection name ```temp```

You can now move on to the next lab.