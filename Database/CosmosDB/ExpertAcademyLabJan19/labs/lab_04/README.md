# Lab 4 - Uploading Data to Cosmos DB with Azure Data Factory v2

In this lab, you will be creating a new Database and Collection, leverage this new Database by uploading flight data from a CSV file to this Cosmos DB instance via Azure Data Factory (ADF).  The CSV data is found at ```https://github.com/OSSCanada/cosmos-db-workshop/raw/master/labs/helper_files/sample_data/sample_data.csv``` Take note of this url as you will need to copy and paste it into ADF as a data source for the data pipeline we're about to create.


## Create a New Database and Collection

In this lab, you will need to create a new Database and Collection in order to write new records/documents into your Cosmos DB instance.

In the previous lab you created your Azure Cosmos DB account, but have not yet created a Database or a Collection into this Account.  A Database in Cosmos DB houses one or many collections. A collection in Cosmos DB would be analogous to a table in a traditional *SQL database and it would house multiple records/documents.  


1. In your Cosmos DB Overview Dashboard you will click on "+ Add Collection" at the top of the Dashboard

1. Since this is your first collection and no databases have been created, you will fill out the form as follows:

    1. In the **Database id** field, enter ```cosmoslab1``` as the Database id/name to create a new Database in your Cosmos DB account
    1. In the **Collection id** field enter ```flights``` as the collection name.  We will be uploading flight records/docuemnts into this collection
    1. For **Storage Capacity** select **Fixed 10GB** DO **NOT** choose unlimited.  We will not be taking advantage of unlimited scale/size for this lab
    1. For **Throughput** leave it at the default of 5000
    1. Click on the button **OK** at the bottom of the blade

1. We will now create an Azure Data Factory Account to upload/migrate CSV data into Cosmos DB

## Create an Azure Data Factory Account

Azure Data Factory service is a fully managed service for composing data storage, processing, and movement services into streamlined, scalable, and reliable data production pipelines.  We will use it as a simple UI driven way to import/upload and populate our Cosmos DB collection with flight data records.  These records represent the flights to and from each airport in the United States over a period of months.  We will be importing over 800,000 records.

**NOTE** There are other methods to import data into Cosmos DB.  You can create your own data pipeline using the various APIs that Cosmos is compatiable with (Document/SQL, Mongo, Cassandra, Gremlin or Table) or with the various SDKs in your programming language of choice.  You can also use other Data Engineering tools like Databricks as well.  Cosmos is very flexible, but we've chose to simply this lab by leveraging Azure Data Factory to streamline the process witout the need for custom code or installing/setting up tools locally to your lab computer.

Follow the instructions below to create your Azure Data Factory Account:

1. On the left side of teh Azure Portal, click the **Create a resource** link
1. Enter the text **Data Factory** into the search field and press **Enter**.
1. In the **Everything** search results blade, select the **Data Factory** result.
1. In the **Data Factory** blade, click the **Create** button.
1. In the new **Data Factory** blade, perform the following actions:
    1. In the **Name** field, enter ```yourname-datafactory```
    1. Leave the **Subscription** field set to its default value
    1. In the **Resource Group** field, enter ```COSMOSLAB``` - i.e. the same resource group name you created for your Cosmos DB account in the first lab
    1. In the **Version** drop down field, choose ```V2```
    1. In the **Location** field, choose ```East US 2``` - we want the ADF to be deployed to the same data center as our Cosmos DB Account
    1. Click the **Create** button at the bottom of the current blade
1. Wait for your Azure Data Factory Account to complete before completing this section

## Create a new Azure Data Factory (ADF) Pipeline

Once your Data Factory account has been created you will navigate to it, and in the Dashboard click on **Author and Montior** in the center of your ADF dashboard.  This will open up your ADF User Interface.

ADF allows you a powerful graphical user interface for creating data pipelines.  We'll get create our pipeline and import our CSV file into Cosmos as JSON with the following steps:

1. Click on **Create Pipeline**
1. Click on **Move & Transform** in the pipeline menu to the left of the new tab window
1. Click, drag and drop **Copy Data** to the main canvas area to the right
1. In the options menu to the bottom of the screen click on **Source**
    1. You will now create a new Data Source for this pipeline
        1. Click the **NEW** button right of the Select Dataset field
        1. In the new blade, scroll down and find and double click on **HTTP** as the data source type
        1. In this new tab, there will be an options menu at the bottom
            1. Click the **Connection** tab
                1. Click the **New** button to the right of ```Linked Service```
                1. For **Base URL** copy and paste: ```https://github.com/OSSCanada/cosmos-db-workshop/raw/master/labs/helper_files/sample_data/sample_data.csv```
                1. For **Authentication Type** select ```Anonymous``` as this is a publiclly accessible file on GitHub
                1. Click **Finish**
            1. While still in the **Connection** tab, scroll down and find the checkbox ```Column names in the first row``` and ensure that it is selected/checked
            1. While still in the **Connection** tab, scroll back up to ```Relative URL``` and click the ```Preview Data``` button to the right
                1. You should see a popup with the CSV data with proper column names and data as a preview
    1. You will now create a new Data Sink (Target/Destination)
        1. Back in the Pipeline Tab Click on the **Sink** tab in the bottom options menu
            1. Click on the **New** button right of the ```Sink Dataset``` field
            1. In the new blade double click **Azure Cosmos DB** as the new sink dataset type
            1. In the new tab that opened, ther is a new options menu in the bottom
                1. click on the **Connection** tab
                    1. to the right of **Linked Service** Click on the **New** button
                        1. In the **Account Selection Method** drop down field, select ```From Azure Subscription```
                        1. In the **Azure Subscription** drop down field, select your default Azure Subscription
                        1. In the **Cosmos DB account name** drop down field, select the Cosmos DB instance you created in the previous lab
                        1. In the **Database Name** drop down, select the Database name you created in the previous section
                        1. Click **Finish**
                        1. Wait for the connection to complete
                        1. Once the connection completes, you must now pick the collection that records/documents will be written to.  Under **Collection Name** choose ```flights``` (the collection name you created in the previous section)
1. Once you have created your pipeline, data source and data sink (destination) you can now save these by clicking **Publish All** in the top of the ADF dashboard
1. Once all the objects are created you can now navigate back to your pipeline and click **Trigger** to activate this pipeline and begin importing/migrating the CSV data into Cosmos DB.

The steps above establish the data pipeline we will use to import data from a CSV file hosted in GitHub, to our Azure Cosmos DB instance.  The pipeline allows us to define the schema using the first row in the the CSV file and will add those as properties to our documents (JSON) in Cosmos DB.

We will leverage this flight data in our later labs which will process this information inside Azure Databricks via Jupyter Notebooks.

Wait for the Data to transfer before moving on to the next lab.